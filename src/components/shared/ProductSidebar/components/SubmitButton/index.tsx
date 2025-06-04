/** @jsxImportSource @emotion/react */
import PayPalButton from "Components/pages/Register/components/Payment/components/PayPal/components/PayPalButton";
import PrimaryButton from "Components/shared/PrimaryButton";
import ProcessingPopup from "Components/shared/ProcessingPopup";
import showToast, {
    dismissAllErrorToasts
} from "Components/shared/ShowToaster";
import T, { useTranslate } from "Components/shared/Translate";
import WorldPay from "Components/shared/WorldPay";
import { useOrder } from "Contexts/OrderContext";
import { useProducts } from "Contexts/ProductContext";
import { OrderResult } from "Contexts/types/OrderContextTypes";
import { useUser } from "Contexts/UserContext";
import { buildOrderRequest, postOrder } from "Hydra/order";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";
import { PaymentType } from "Types/enums";
import useUserDataMapper from "./hooks";
import styles from "./styles";

type SubmitButtonProps = {
    showPricingBreakdown?: boolean;
};

const ORDER_ERRORS = {
    DUPLICATE_ORDER: "1603"
} as const;

export default function SubmitButton({
    showPricingBreakdown = false
}: SubmitButtonProps): JSX.Element {
    const { userToken, href } = useUser();
    const router = useRouter();

    const {
        selectedShippingMethod,
        selectedPaymentMethod,
        orderResult,
        setOrderResult,
        isCreditCardPaymentValid,
        billingAddress,
        shipToAddress
    } = useOrder();

    const translate = useTranslate();
    const orderData = useUserDataMapper();
    const paymentMethod = useMemo(
        () => orderData?.payment?.method,
        [orderData]
    );
    const [showPaymentLoader, setShowPaymentLoader] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isKlarnaRedirect, setIsKlarnaRedirect] = useState(false);

    // Add mounted ref to track component lifecycle
    const isMounted = useRef(true);

    // Cleanup on unmount
    useEffect(
        () => () => {
            isMounted.current = false;
        },
        []
    );

    useEffect(() => {
        if (sessionStorage.getItem("klarnaRedirect")) {
            setIsKlarnaRedirect(true);
            sessionStorage.removeItem("klarnaRedirect");
        }
    }, []);

    const submitDisabled = useMemo(
        () =>
            !selectedShippingMethod?.orderTotal ||
            !selectedPaymentMethod ||
            (selectedPaymentMethod === "CreditCard" &&
                !isCreditCardPaymentValid) ||
            isSubmitting,
        [
            selectedShippingMethod?.orderTotal,
            selectedPaymentMethod,
            isCreditCardPaymentValid,
            isSubmitting
        ]
    );
    const { shoppingCart, ufgVariants } = useProducts();

    const validateUserSession = useCallback((): boolean => {
        if (!userToken) {
            showToast("Error: Session expired, please login again.", "error");
            router.push({
                pathname: "/logout"
            });
            return false;
        }
        return true;
    }, [userToken, router]);

    const handleInitialSetup = (event?: React.SyntheticEvent): void => {
        if (event) {
            event.preventDefault();
        }
        mixpanelService.trackEvent(MixpanelEvent.ENROLLMENT_CLICKED, {
            payment_method:
                PaymentType[
                    orderData.payment.method as keyof typeof PaymentType
                ]
        });
        dismissAllErrorToasts();
        setShowPaymentLoader(true);
    };

    const buildOrder = useCallback(
        async (worldPaySessionId?: string | null): Promise<any | null> => {
            try {
                return await buildOrderRequest(
                    { ...orderData, worldPaySessionId },
                    userToken as string,
                    href as string
                );
            } catch (error) {
                console.error("Error building order request:", error);
                setShowPaymentLoader(false);
                return null;
            }
        },
        [orderData, userToken, href]
    );

    const handleOrderError = useCallback(
        (error: any) => {
            setShowPaymentLoader(false);
            let errorMessage = translate("error_payment_credit_card_default");

            if (error.errorCode === ORDER_ERRORS.DUPLICATE_ORDER) {
                errorMessage = error.message;
            }

            showToast(errorMessage, "error");
            mixpanelService.trackEvent(MixpanelEvent.ENROLLMENT_SERVER_ERROR, {
                response_code: error.code,
                payment_method:
                    PaymentType[paymentMethod as keyof typeof PaymentType],
                error_message: error.message,
                error_provider: "hydra",
                billing_address_same_as_shipping:
                    billingAddress?.address1 === shipToAddress?.address1,
                enrollment_with_payment: true
            });
        },
        [translate, paymentMethod, billingAddress, shipToAddress]
    );

    const handleOrderSuccess = useCallback(
        (orderResults: OrderResult) => {
            const methodDetails =
                orderResults?.transactions?.items[0]?.methodDetails;
            const unicityOrderId = orderResults?.id?.unicity;

            // URLs for redirection
            const thankYouUrl = `${window.location.origin}/thank-you?orderId=${unicityOrderId}`;
            const registerUrl = `${window.location.origin}/register`;

            const encodedThankYouUrl = encodeURIComponent(thankYouUrl);
            const encodedRegisterUrl = encodeURIComponent(registerUrl);

            // Construct Klarna redirect URL if available
            let klarnaRedirectUrl = methodDetails?.hostedPaymentPageUrl;
            if (klarnaRedirectUrl) {
                klarnaRedirectUrl += `&successURL=${encodedThankYouUrl}&pendingURL=${encodedRegisterUrl}&failureURL=${encodedRegisterUrl}&cancelURL=${encodedRegisterUrl}`;
            }

            // Create a unified result object with payment-related data
            const processedResults = {
                ...orderResults,
                challengeHTML: methodDetails?.challengeHTML,
                payPall3dsUrl: methodDetails?.iouReceipt?.url,
                klarnaRedirectUrl
            };

            // Handle redirections based on available payment flows
            if (processedResults.payPall3dsUrl) {
                setOrderResult({ ...processedResults });
                window.location.href = processedResults.payPall3dsUrl;
                return processedResults;
            }

            if (processedResults.klarnaRedirectUrl) {
                setOrderResult({ ...processedResults, externalRedirect: true });
                sessionStorage.setItem("klarnaRedirect", "1");
                window.location.href = processedResults.klarnaRedirectUrl;
                return processedResults;
            }

            if (processedResults.challengeHTML) {
                setOrderResult(processedResults);
                // 3DS challenge will be handled in component
                return processedResults;
            }

            // Default fallback: redirect to thank-you page
            setOrderResult(processedResults);
            router.replace({
                pathname: "/thank-you",
                query: { orderId: unicityOrderId }
            });

            return processedResults;
        },
        [router, setOrderResult]
    );

    const handleSubmit = useCallback(
        async (
            event?: React.SyntheticEvent,
            worldPaySessionId?: string | null
        ): Promise<OrderResult | null> => {
            if (isSubmitting) {
                return null;
            }
            setIsKlarnaRedirect(false);
            sessionStorage.removeItem("klarnaRedirect");

            setIsSubmitting(true);
            handleInitialSetup(event);

            if (!validateUserSession()) {
                setIsSubmitting(false);
                return null;
            }

            const orderRequest = await buildOrder(worldPaySessionId);
            if (!orderRequest) {
                setIsSubmitting(false);
                return null;
            }

            try {
                const orderResults = await postOrder(orderRequest);
                return handleOrderSuccess(orderResults);
            } catch (error: any) {
                handleOrderError(error);
            } finally {
                // Only update state if component is still mounted
                if (isMounted.current) {
                    setIsSubmitting(false);
                    setShowPaymentLoader(false);
                }
            }
            return null;
        },
        [
            isSubmitting,
            validateUserSession,
            buildOrder,
            handleOrderError,
            handleOrderSuccess,
            setShowPaymentLoader,
            shoppingCart,
            ufgVariants,
            handleInitialSetup
        ]
    );

    useEffect(() => {
        if (orderResult?.klarnaRedirectUrl && isKlarnaRedirect) {
            showToast(translate("payment_error_message"), "error");
        }
    }, [orderResult?.klarnaRedirectUrl, isKlarnaRedirect, translate]);

    return (
        <div css={styles}>
            {showPaymentLoader && <ProcessingPopup />}
            {selectedPaymentMethod === "PayPal" ? (
                <PayPalButton
                    handleSubmit={handleSubmit}
                    amount={selectedShippingMethod?.orderTotal}
                    disabled={isSubmitting}
                />
            ) : (
                showPricingBreakdown && (
                    <div className="fade-in">
                        <WorldPay>
                            <PrimaryButton
                                className="button"
                                disabled={submitDisabled}
                                onClick={handleSubmit}
                                data-testid="button_complete_enrollment"
                            >
                                <T>button_complete_enrollment</T>
                            </PrimaryButton>
                        </WorldPay>
                    </div>
                )
            )}
        </div>
    );
}
