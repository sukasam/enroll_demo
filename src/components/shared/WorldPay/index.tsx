import { useCountryConfig } from "Constants/countryConfig";
import { useOrder } from "Contexts/OrderContext";
import {
    CreditCardPayment,
    OrderResult
} from "Contexts/types/OrderContextTypes";
import { useFlags } from "launchdarkly-react-client-sdk";
import { memo, useCallback, useMemo, useState } from "react";
import modifyChildrenSubmit from "./ModifyChildrenSubmit";
import WorldPayChallengeModel from "./WorldPayChallengeModel";
import WorldPayDDC from "./WorldPayDDC";

type WorldPayProps = {
    children: React.ReactNode;
};

function WorldPay({ children }: WorldPayProps): JSX.Element {
    const [challengeHTML, setChallengeHTML] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitWorldPayDDC, setSubmitWorldPayDDC] = useState<
        () => Promise<string>
    >(() => async () => "");

    const { orderResult, paymentMethod, selectedPaymentMethod } = useOrder();
    const countryConfig = useCountryConfig();

    const { useWorldPayEu } = useFlags();

    const useWorldPay = useMemo((): boolean => {
        const useWorldPayMarketException =
            countryConfig?.marketExceptions?.useWorldPay ?? false;
        const useWorldPayEuFlag = useWorldPayEu || false;
        const isCreditCard = selectedPaymentMethod === "CreditCard";
        const result =
            useWorldPayMarketException && useWorldPayEuFlag && isCreditCard;
        const consoleColor =
            useWorldPayMarketException && !useWorldPayEuFlag ? "red" : "green";
        console.vlog("--- WP useWorldPay:", consoleColor, {
            useWorldPayMarketException,
            useWorldPayEuFlag,
            isCreditCard
        }); // keep this in Prod

        return result;
    }, [useWorldPayEu, countryConfig, selectedPaymentMethod]);

    const closeChallengeModal = async (): Promise<void> => {
        setChallengeHTML(null);
    };

    const modifiedHandleSubmit = useCallback(
        async (
            handleSubmit: (
                event?: React.SyntheticEvent,
                worldPaySessionId?: string | null
            ) => Promise<OrderResult>
        ) => {
            if (isSubmitting) {
                return;
            }

            try {
                setIsSubmitting(true);
                let worldPaySessionId = null;
                if (useWorldPay) {
                    worldPaySessionId = await submitWorldPayDDC();
                    console.vlog(
                        "--- WP modifiedHandleSubmit worldPaySessionId: ",
                        worldPaySessionId ? "green" : "red",
                        worldPaySessionId
                    );
                }
                const _orderResult: OrderResult = await handleSubmit(
                    undefined,
                    worldPaySessionId
                );
                if (_orderResult && _orderResult?.challengeHTML) {
                    console.vlog("--- WP hasChallengeHTML", "green");
                    setChallengeHTML(_orderResult?.challengeHTML);
                } else {
                    console.vlog("--- WP No ChallengeHTML", "gray");
                }
            } finally {
                setIsSubmitting(false);
            }
        },
        [submitWorldPayDDC, isSubmitting, useWorldPay]
    );

    const modifiedChildren = useMemo(
        () =>
            useWorldPay
                ? modifyChildrenSubmit(children, modifiedHandleSubmit)
                : children,
        [children, useWorldPay, modifiedHandleSubmit]
    );

    return (
        <>
            {useWorldPay ? (
                <>
                    <WorldPayDDC
                        paymentMethod={paymentMethod as CreditCardPayment}
                        setSubmitWorldPayDDC={setSubmitWorldPayDDC}
                    />
                    <WorldPayChallengeModel
                        challengeHTML={challengeHTML}
                        closeModal={closeChallengeModal}
                        eventOrderId={orderResult?.id.unicity || null}
                    />
                </>
            ) : null}
            {modifiedChildren}
        </>
    );
}

export default memo(WorldPay);
