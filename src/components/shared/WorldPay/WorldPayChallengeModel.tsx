import extractMessage from "Components/pages/Redirect/components/extractMessage";
import showToast, {
    dismissAllErrorToasts
} from "Components/shared/ShowToaster";
import StyledModal from "Components/shared/StyledModal";
import { useTranslate } from "Components/shared/Translate";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useRef } from "react";
import { logError } from "Services/datadog/datadogLoggingService";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import { MixpanelPaymentMethod } from "Types/enums";

type WorldPayChallengeModelProps = {
    challengeHTML: string | null;
    closeModal: () => void;
    eventOrderId: string | null;
};

function WorldPayChallengeModel({
    challengeHTML,
    closeModal,
    eventOrderId
}: WorldPayChallengeModelProps): JSX.Element | null {
    const challengeRef = useRef<HTMLIFrameElement>(null);
    const translate = useTranslate();

    // Use this testing data to test the success and failure cases
    // ** manualTesting should always be false in production **
    const manualTesting = false; // trigger manual testing for routing to success or failure
    const testSuccess = false; // trigger success or failure for the route
    const failedCase =
        "http://localhost/redirect?tppPayload=%7B%22eventDetails%22%3A%7B%22error%22%3A%7B%22error%22%3A402%2C%22error_code%22%3A%223009%22%2C%22error_message%22%3A%22We+failed+to+accept+the+credit+card+payment+for+the+following+reason%3A+%27Unable+to+complete+the+request.%27+Error+%23J3B3D%22%7D%7D%7D";
    const successCase =
        "http://localhost/redirect?tppPayload=%7B%22eventDetails%22%3A%7B%22href%22%3A%22https%3A%5C%2F%5C%2Fhydraqa.unicity.net%5C%2Fv5a-test%5C%2Forders%5C%2Fa4f0f50601652a6a1cc8eaab751dcb941dd9651838c71295bca03b227f75847b%22%2C%22id%22%3A%7B%22unicity%22%3A%2249-9402226%22%7D%7D%7D";

    const router = useRouter();

    const messageCallback = useCallback(
        (event: MessageEvent): void => {
            let json: { domain?: string; redirectURL?: string } = {};
            try {
                json = JSON.parse(event.data);
            } catch (e) {
                // pass
            }

            // Only redirect a postMessage that we are expecting
            if (json.domain === "enrollment.unicity" && json.redirectURL) {
                const message = extractMessage(json.redirectURL);
                closeModal();

                if (message?.id?.unicity) {
                    dismissAllErrorToasts();
                    router.push({
                        pathname: "/thank-you",
                        query: { orderId: message?.id?.unicity }
                    });
                } else if (message?.error) {
                    const unknownErrorMessage =
                        "Unknown error during 3DS Challenge";
                    mixpanelService.trackEvent("enr_enrollment_server_error", {
                        payment_method:
                            MixpanelPaymentMethod.CreditCardWorldPay,
                        error_provider: "worldpay",
                        error_message:
                            message.error?.error_message || unknownErrorMessage,
                        enrollment_with_payment: true
                    });
                    logError(
                        message.error || unknownErrorMessage,
                        "Make order (OTP)"
                    );

                    showToast(
                        translate("error_payment_credit_card_default"),
                        "error"
                    );
                } else {
                    const errorMessage =
                        "Sorry for the inconvenience, an unknown error has occurred.";
                    mixpanelService.trackEvent("enr_enrollment_server_error", {
                        payment_method:
                            MixpanelPaymentMethod.CreditCardWorldPay,
                        error_provider: "worldpay",
                        error_message: errorMessage,
                        enrollment_with_payment: true
                    });
                    logError(errorMessage, "Make order (OTP)");
                    showToast(errorMessage, "error");
                }
            }
        },
        [closeModal, router]
    );

    useEffect(() => {
        if (!eventOrderId) return undefined;
        window.addEventListener("message", messageCallback);
        return () => {
            window.removeEventListener("message", messageCallback);
        };
    }, [eventOrderId, messageCallback]);

    const getSrc = (): string | undefined => {
        if (!manualTesting) return undefined;
        return testSuccess ? successCase : failedCase;
    };

    return challengeHTML ? (
        <StyledModal fullPage isOpen handleClose={closeModal}>
            <iframe
                title="WorldPayChallenge"
                height="400px"
                id="wpStepUp"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation allow-modals allow-popups-to-escape-sandbox allow-presentation"
                ref={challengeRef}
                srcDoc={manualTesting ? undefined : challengeHTML}
                src={getSrc()}
                width="100%"
            />
        </StyledModal>
    ) : null;
}

export default memo(WorldPayChallengeModel);
