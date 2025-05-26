/** @jsxImportSource @emotion/react */
import PrimaryButton from "Components/shared/PrimaryButton";
import Spinner from "Components/shared/Spinner";
import T, { useTranslate } from "Components/shared/Translate";
import { useCountryConfig } from "Constants/countryConfig";
import { Alpha2 } from "Constants/countryConfig/enums";
import { useOrder } from "Contexts/OrderContext";
import { useUser } from "Contexts/UserContext";
import { useTranslations } from "Contexts/translation";
import { OrderResult } from "Contexts/types/OrderContextTypes";
import getPayPalToken from "Hydra/getPayPalToken";
import braintree from "braintree-web";
import type { CancellationData } from "paypal-checkout-components/modules/callback-data";
import { useEffect, useState } from "react";
import styles from "./styles";

interface PayPalProps {
    handleSubmit: (
        event?: React.SyntheticEvent,
        worldPaySessionId?: string | null
    ) => Promise<OrderResult | null>;
    amount?: string;
    disabled?: boolean;
}

function PayPalButton(props: PayPalProps): JSX.Element {
    const { amount, handleSubmit, disabled } = props;

    const translate = useTranslate();
    const { country } = useTranslations();
    const { userData } = useUser();
    const { setPayPal, billingAddress, shipToAddress } = useOrder();

    const [payPalApproved, setPayPalApproved] = useState(false);

    const countryConfig = useCountryConfig();

    const setPayPalData = (paypalData?: {
        firstName: string;
        lastName: string;
        nonce?: string;
    }): void => {
        setPayPalApproved(true);
        if (paypalData) {
            setPayPal({
                ...paypalData,
                usePayPal3ds:
                    countryConfig?.marketExceptions.usePayPal3ds || false
            });
        }
    };

    useEffect(() => {
        let isMounted = true;
        if (!userData) {
            return "" as never;
        }
        const { firstName, lastName, phoneNumber } = userData;

        const payPalFailHandler = (error: string | CancellationData): void => {
            if (
                typeof error === "string" &&
                error.includes(
                    "Error: Document is ready and element #paypal-button-container does not exist"
                )
            ) {
                console.log("Non-fatal error, PayPal button will re-render");
                return;
            }
            console.error("PayPal error:", error);
        };

        async function loadPayPal(): Promise<void> {
            const { token } = await getPayPalToken({
                market: country === Alpha2.PR ? Alpha2.US : country
            });
            const client = await braintree.client.create({
                authorization: token
            });
            const paypalCheckout = await braintree.paypalCheckout.create({
                client
            });
            const paypalSDK = await paypalCheckout.loadPayPalSDK({
                currency: countryConfig?.currency || "USD",
                intent: "capture"
            });

            const button = window.paypal.Buttons({
                style: {
                    size: "large",
                    color: "gold",
                    shape: "pill",
                    label: "checkout",
                    height: 47
                } as never,
                fundingSource: window.paypal.FUNDING.PAYPAL as never as string,
                createOrder(): Promise<never> | never {
                    if (disabled) {
                        return Promise.reject(new Error("Button is disabled"));
                    }
                    return paypalSDK.createPayment({
                        flow: "checkout" as never,
                        amount,
                        currency: countryConfig?.currency || "USD",
                        intent: "capture" as never,
                        enableShippingAddress: true,
                        shippingAddressEditable: false,
                        shippingAddressOverride: {
                            recipientName: `${firstName} ${lastName}`,
                            line1:
                                billingAddress?.address1 ||
                                shipToAddress?.address1 ||
                                "",
                            line2:
                                billingAddress?.address2 ||
                                shipToAddress?.address2 ||
                                "",
                            city:
                                billingAddress?.city ||
                                shipToAddress?.city ||
                                "",
                            countryCode: country,
                            postalCode:
                                billingAddress?.zip || shipToAddress?.zip || "",
                            state:
                                billingAddress?.state ||
                                shipToAddress?.state ||
                                "",
                            phone: phoneNumber
                        }
                    }) as never;
                },
                async onClick() {
                    if (disabled) {
                        return false;
                    }
                    return null;
                },
                onApprove(data): Promise<any> {
                    return paypalSDK
                        .tokenizePayment(data)
                        .then((payload: any) => {
                            if (!isMounted) return;
                            const {
                                nonce,
                                details: { firstName, lastName }
                            } = payload;
                            setPayPalData({ nonce, firstName, lastName });
                        })
                        .catch((error: any) => {
                            console.error("Error tokenizing payment:", error);
                        });
                },
                onCancel: payPalFailHandler,
                onError: payPalFailHandler
            });

            button.render("#paypal-button-container");
        }

        if (countryConfig?.marketExceptions.usePayPal3ds) {
            setPayPalData({
                firstName: firstName || "",
                lastName: lastName || ""
            });
        } else {
            loadPayPal();
        }

        return () => {
            isMounted = false;
        };
    }, [
        amount,
        billingAddress,
        country,
        countryConfig?.currency,
        shipToAddress,
        setPayPal,
        translate,
        userData
    ]);

    return payPalApproved ? (
        <PrimaryButton
            className="button"
            onClick={handleSubmit}
            disabled={disabled}
        >
            <T>button_complete_enrollment</T>
        </PrimaryButton>
    ) : (
        <div
            css={styles}
            id="paypal-button-container"
            className="fade-in"
            data-testid="paypal_container_button"
        >
            <PrimaryButton disabled className="paypal-loader">
                <Spinner height="35px" />
            </PrimaryButton>
        </div>
    );
}

export default PayPalButton;
