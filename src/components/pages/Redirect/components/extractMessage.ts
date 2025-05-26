import { EventDetails } from "Contexts/types/OrderContextTypes";
import { logError } from "Services/datadog/datadogLoggingService";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import { MixpanelPaymentMethod } from "Types/enums";

export default function extractMessage(url: string): EventDetails | null {
    const decodedUrl = decodeURIComponent(url);

    try {
        const urlParams = new URLSearchParams(decodedUrl.split("?")[1]);
        const tppPayload = urlParams.get("tppPayload");
        if (!tppPayload) return null;
        const payloadObject = JSON.parse(tppPayload);

        if (payloadObject && payloadObject.eventDetails) {
            return { ...payloadObject.eventDetails, url };
        }
        return null;
    } catch (error) {
        mixpanelService.trackEvent("enr_enrollment_server_error", {
            payment_method: MixpanelPaymentMethod.CreditCardWorldPay,
            error_provider: "worldpay",
            enrollment_with_payment: true
        });
        logError(error, "Make order (OTP)");
        return null;
    }
}
