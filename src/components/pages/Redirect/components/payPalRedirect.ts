import { dismissAllErrorToasts } from "Components/shared/ShowToaster";
import { EventDetails } from "Contexts/types/OrderContextTypes";
import type { NextRouter } from "next/router";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import { PaymentType } from "Types/enums";

export default function PayPalRedirect(
    message: EventDetails | null,
    router: NextRouter,
    setActiveAccordionSection: (section: number) => void,
    translate: (key: string) => string
): void {
    if (message?.id?.unicity) {
        console.vlog("--- PayPal3ds Redirect success", "green", message);
        dismissAllErrorToasts();
        mixpanelService.trackEvent("enr_enrollment_completed", {
            enrollment_with_payment: true,
            payment_method: PaymentType.PayPal3ds
        });
        router.push({
            pathname: "/thank-you",
            query: { orderId: message?.id?.unicity }
        });
    } else if (message?.error) {
        console.vlog("--- PayPal3ds Redirect", "red", message);
        setActiveAccordionSection(5);
        mixpanelService.trackEvent("enr_enrollment_server_error", {
            payment_method: PaymentType.PayPal3ds,
            error_provider: PaymentType.PayPal3ds,
            error_message: message.error.error_message,
            enrollment_with_payment: true
        });
        router.push({
            pathname: "/register",
            query: {
                toasterType: "error",
                toasterMessage: translate("error_payment_credit_card_default")
            }
        });
    } else {
        const errorMessage =
            "Sorry for the inconvenience, an unknown error has occurred.";
        console.vlog("--- PayPal3ds Redirect", "red", {
            ...message,
            unknownError: errorMessage
        });
        setActiveAccordionSection(5);
        mixpanelService.trackEvent("enr_enrollment_server_error", {
            payment_method: PaymentType.PayPal3ds,
            error_provider: PaymentType.PayPal3ds,
            error_message: errorMessage,
            enrollment_with_payment: true
        });
        router.push({
            pathname: "/register",
            query: { toasterType: "error", toasterMessage: errorMessage }
        });
    }
}
