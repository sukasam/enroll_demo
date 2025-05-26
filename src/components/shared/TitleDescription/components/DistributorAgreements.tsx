import T from "Components/shared/Translate";
import { useOrder } from "Contexts/OrderContext";
import { useTranslations } from "Contexts/translation";
import useSectionComplete from "Hooks/useSectionComplete";
import { useMemo } from "react";

export default function DistributorAgreementsHooks(): JSX.Element | null {
    const { signatureDateTimeStamp } = useOrder();
    const { isDistributorAgreementComplete } = useSectionComplete();
    const { country, language } = useTranslations();
    const formattedDate = useMemo(() => {
        if (
            !isDistributorAgreementComplete ||
            signatureDateTimeStamp === null
        ) {
            return null;
        }

        try {
            const options: Intl.DateTimeFormatOptions = {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            };

            const locale = `${language}-${country}`;

            return new Intl.DateTimeFormat(locale, options).format(
                new Date(signatureDateTimeStamp)
            );
        } catch (error) {
            console.error(error);
            return null;
        }
    }, [isDistributorAgreementComplete, signatureDateTimeStamp]);

    if (!formattedDate) {
        return null;
    }

    return (
        <div data-testid="agreement_signed">
            <T>agreement_signed</T>: {formattedDate}
        </div>
    );
}
