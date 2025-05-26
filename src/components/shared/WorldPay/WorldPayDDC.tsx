import { CreditCardPayment } from "Contexts/types/OrderContextTypes";
import { useUser } from "Contexts/UserContext";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import initDDC from "Services/worldPay/worldPay";

// Custom hook to create a promise that resolves when the iframe loads
function useIframeLoadPromise(): {
    createPromise: () => Promise<void>;
    onLoad: () => void;
    promise: Promise<void> | null;
} {
    const [promise, setPromise] = useState<Promise<void> | null>(null);
    const iframeLoadedRef = useRef(false);

    const createPromise = useCallback(() => {
        console.vlog("--- WP useIframeLoadPromise: createPromise", "gray");
        iframeLoadedRef.current = false;
        const newPromise = new Promise<void>(resolve => {
            const checkLoaded = (): void => {
                if (iframeLoadedRef.current) {
                    console.vlog(
                        "--- WP useIframeLoadPromise: resolve",
                        "gray"
                    );
                    resolve();
                } else {
                    setTimeout(checkLoaded, 100);
                }
            };
            checkLoaded();
        });
        setPromise(newPromise);
        return newPromise;
    }, []);

    const onLoad = useCallback(() => {
        console.vlog("--- WP useIframeLoadPromise: onLoad", "gray");
        iframeLoadedRef.current = true;
    }, []);

    return { createPromise, onLoad, promise };
}

type WorldPayDDCProps = {
    paymentMethod: CreditCardPayment;
    setSubmitWorldPayDDC: React.Dispatch<
        React.SetStateAction<() => Promise<string>>
    >;
};

type DDCResponse = {
    ddcHTML: string;
    sessionId: string;
};

function WorldPayDDC({
    paymentMethod,
    setSubmitWorldPayDDC
}: WorldPayDDCProps): JSX.Element | null {
    const ddcRef = useRef<HTMLIFrameElement | null>(null);
    const { createPromise, onLoad } = useIframeLoadPromise();
    const [ddcHtml, setDdcHtml] = useState<string | undefined>(undefined);
    const { userToken } = useUser();

    const checkWorldPay = async (): Promise<string> => {
        const ddcResponse: DDCResponse = await initDDC(
            paymentMethod.creditCardNumber,
            userToken as string
        );
        setDdcHtml(decodeURIComponent(ddcResponse.ddcHTML));
        const newPromise = createPromise();
        await newPromise;
        console.vlog("--- WP checkWorldPay: compeated ddc call", "green");
        return ddcResponse.sessionId;
    };

    const handleSubmitWorldPayDDC: () => Promise<string> = async () => {
        if (
            paymentMethod?.type === "CreditCard" &&
            paymentMethod?.creditCardNumber
        ) {
            const sessionId = await checkWorldPay();
            return sessionId;
        }
        return "";
    };

    useEffect(() => {
        setSubmitWorldPayDDC(() => handleSubmitWorldPayDDC);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, [paymentMethod?.creditCardNumber, paymentMethod?.type]);

    return ddcHtml ? (
        <iframe
            title="ddc"
            height="100%"
            hidden
            id="UniWpDDC"
            ref={ddcRef}
            srcDoc={ddcHtml}
            width="100%"
            onLoad={onLoad}
        />
    ) : null;
}

export default memo(WorldPayDDC);
