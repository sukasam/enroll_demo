import ThankYou from "Components/pages/ThankYou";
import PageSpinner from "Components/shared/PageSpinner";
import {
    PageWrapper,
    PageWrapperServerProps,
    getServerSideProps
} from "Components/shared/PageWrapper";
import StyledModal from "Components/shared/StyledModal";
import UserFeedback from "Components/shared/UserFeedback";
import { useOrder } from "Contexts/OrderContext";
import { useProducts } from "Contexts/ProductContext";
import useConsent from "Hooks/useConsent";
import { useFlags } from "launchdarkly-react-client-sdk";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";
import { PaymentType } from "Types/enums";

type FeedbackPosition = "modal" | "aside" | "none";
type FeedbackState = {
    position: FeedbackPosition;
    rating: number | null;
    hasRated: boolean;
};

export default function Page(props: PageWrapperServerProps): JSX.Element {
    const {
        orderResult,
        isDigitalOnlyOrder,
        feedbackSubmitted,
        setFeedbackSubmitted,
        setIsEnrollmentCompleted,
        isEnrollmentCompleted
    } = useOrder();
    const { shoppingCart, ufgVariants } = useProducts();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isRouteValid, setIsRouteValid] = useState(false);
    const [feedbackState, setFeedbackState] = useState<FeedbackState>({
        position: "aside" as FeedbackPosition,
        rating: null as number | null,
        hasRated: false
    });
    const { useUserFeedback } = useFlags();
    const consentData = useConsent();

    const handleRouteValidation = useCallback(() => {
        try {
            const hasOrderId = !!router.query.orderId;
            const noPurchase = router.query.noPurchase === "true";

            // Don't do anything if we're still loading
            if (!router.isReady) {
                return false;
            }

            // Allow access if we have any of these conditions
            if (hasOrderId || noPurchase || orderResult) {
                setIsLoading(false);
                setIsRouteValid(true);
                return true;
            }

            // Only redirect if we're sure we don't have access and the router is ready
            if (router.isReady && !hasOrderId && !noPurchase && !orderResult) {
                // Use replace instead of push to prevent back button issues
                router.replace("/home", undefined, { shallow: true });
                return false;
            }

            return false;
        } catch (error) {
            console.error("Error in route validation:", error);
            // Use replace instead of push to prevent back button issues
            router.replace("/home", undefined, { shallow: true });
            return false;
        }
    }, [orderResult, router]);

    useEffect(() => {
        const validateRoute = async (): Promise<void> => {
            try {
                await handleRouteValidation();
            } catch (error) {
                console.error("Error validating route:", error);
                router.replace("/home");
            }
        };
        validateRoute();
    }, [handleRouteValidation, router]);

    const onFeedbackChange = useCallback(
        (_: React.SyntheticEvent, rating: number | null): void => {
            if (rating !== null) {
                setFeedbackState({
                    position: "none",
                    rating,
                    hasRated: true
                });
                setIsModalOpen(false);
                mixpanelService.trackEvent(MixpanelEvent.FEEDBACK_RATED, {
                    rating: rating ? rating.toString() : "0"
                });
                setFeedbackSubmitted(true);
            }
        },
        [setFeedbackSubmitted]
    );

    const onModalClose = useCallback((): void => {
        setFeedbackState(prev => ({
            ...prev,
            position: "aside",
            hasRated: false
        }));
        setIsModalOpen(false);
    }, []);

    useEffect(() => {
        if (feedbackState.position === "modal" && !feedbackSubmitted) {
            mixpanelService.trackEvent(MixpanelEvent.FEEDBACK_APPEARS);
        }
    }, [feedbackState.position, feedbackSubmitted]);

    useEffect(() => {
        let hasTrackedDismissal = false;

        const handleRouteChange = (): void => {
            if (!feedbackState.hasRated && !hasTrackedDismissal) {
                hasTrackedDismissal = true;
                mixpanelService.trackEvent(MixpanelEvent.FEEDBACK_DISMISSED, {
                    rating: feedbackState.rating
                        ? feedbackState.rating.toString()
                        : "0"
                });
            }
        };

        router.events.on("routeChangeStart", handleRouteChange);

        return () => {
            router.events.off("routeChangeStart", handleRouteChange);
        };
    }, [router, feedbackState.hasRated, feedbackState.rating]);

    useEffect(() => {
        if (!orderResult || router.query.noPurchase || isEnrollmentCompleted)
            return;

        mixpanelService.trackEvent(MixpanelEvent.ENROLLMENT_COMPLETED, {
            enrollment_with_payment: !router.query.noPurchase,
            payment_method:
                PaymentType[
                    orderResult?.transactions?.items?.[0]
                        ?.method as keyof typeof PaymentType
                ] || "none",
            shipping_method: orderResult?.shippingMethod?.type || "none",
            shipping_country: orderResult?.shipToAddress?.country,
            shipping_state: orderResult?.shipToAddress?.state,
            shipping_city: orderResult?.shipToAddress?.city,
            item_sku: orderResult?.lines?.items?.[0]?.item?.id?.unicity,
            item_type: isDigitalOnlyOrder
                ? "digital_guide"
                : "business_builder",
            item_flavour: isDigitalOnlyOrder
                ? "digital_guide"
                : `${shoppingCart[0]?.options?.unimate_flavour?.title} / ${shoppingCart[0]?.options?.balance_pack?.title}`,
            item_flavour_options: ufgVariants
                .map(
                    variant =>
                        `${variant?.options?.unimate_flavour?.title} / ${variant?.options?.balance_pack?.title}`
                )
                .join(", "),
            shipping_total:
                orderResult?.terms?.freight?.amount?.toString() || "0",
            tax_total: orderResult?.terms?.tax?.amount?.toString() || "0",
            subtotal: orderResult?.terms?.subtotal?.toString() || "0",
            order_total: orderResult?.terms?.total?.toString() || "0",
            currency: orderResult?.currency || "USD"
        });
        setIsEnrollmentCompleted(true);
    }, [
        orderResult,
        router.query.noPurchase,
        shoppingCart,
        ufgVariants,
        isDigitalOnlyOrder,
        isEnrollmentCompleted,
        setIsEnrollmentCompleted
    ]);

    const NotShowFeedback = useCallback((): boolean => {
        try {
            if (!consentData) return false;
            const analytics = consentData?.analytics === "yes";
            return !analytics || false;
        } catch (error) {
            console.error("Error parsing consent cookie:", error);
            return false;
        }
    }, [consentData]);

    useEffect(() => {
        if (feedbackSubmitted || NotShowFeedback()) {
            setFeedbackState({
                position: "none",
                rating: null,
                hasRated: !NotShowFeedback()
            });
            setIsModalOpen(false);
        }
    }, [feedbackSubmitted, consentData, NotShowFeedback]);

    if (
        !router.isReady ||
        isLoading ||
        (!orderResult && !router.query.noPurchase)
    ) {
        return <PageSpinner />;
    }

    if (!isRouteValid) {
        return <PageSpinner />;
    }

    if (!useUserFeedback) {
        return (
            <PageWrapper
                {...props}
                title="website_title_thank_you"
                description="website_description_thank_you"
                hideLocale
                referralBar
                background="#f5f8fc"
            >
                <ThankYou />
            </PageWrapper>
        );
    }

    const feedbackComponent =
        feedbackState.position === "aside" ? (
            <UserFeedback
                value={feedbackState.rating}
                onFeedbackChange={onFeedbackChange}
                variant="aside"
                onTimerComplete={onModalClose}
            />
        ) : null;

    return (
        <PageWrapper
            {...props}
            title="website_title_thank_you"
            description="website_description_thank_you"
            hideLocale
            referralBar
            background="#f5f8fc"
        >
            <ThankYou feedbackComponent={feedbackComponent} />
            {feedbackState.position === "modal" && (
                <StyledModal
                    fullPage
                    isOpen={isModalOpen}
                    handleClose={onModalClose}
                >
                    <UserFeedback
                        value={feedbackState.rating}
                        onFeedbackChange={onFeedbackChange}
                        showTimer
                        onTimerComplete={onModalClose}
                    />
                </StyledModal>
            )}
        </PageWrapper>
    );
}

export { getServerSideProps };
