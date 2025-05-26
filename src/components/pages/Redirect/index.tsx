import { useTranslate } from "Components/shared/Translate";
import { useOrder } from "Contexts/OrderContext";
import { useUser } from "Contexts/UserContext";
import { useRouter } from "next/router";
import { memo, useEffect } from "react";
import extractMessage from "./components/extractMessage";
import PayPalRedirect from "./components/payPalRedirect";
import worldPayRedirect from "./components/worldPayRedirect";

function Redirect(): JSX.Element {
    const router = useRouter();
    const { orderResult, setTppPayload } = useOrder();
    const { setActiveAccordionSection } = useUser();
    const translate = useTranslate();

    useEffect(() => {
        if (!orderResult) return;

        const redirectURL = window.location.href;
        const message = extractMessage(redirectURL);
        setTppPayload(message);

        if (orderResult?.payPall3dsUrl) {
            PayPalRedirect(
                message,
                router,
                setActiveAccordionSection,
                translate
            );
        } else if (orderResult?.challengeHTML) {
            worldPayRedirect(redirectURL);
        }
    }, [orderResult]);

    return <h4>Processing your payment...</h4>;
}

export default memo(Redirect);
