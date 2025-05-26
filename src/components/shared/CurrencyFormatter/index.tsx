import Spinner from "Components/shared/Spinner";
import T from "Components/shared/Translate";
import { useCountryConfig } from "Constants/countryConfig";
import { useTranslations } from "Contexts/translation";
import { ReactNode } from "react";

type CurrencyFormatterProps = {
    children: ReactNode;
    currency?: string;
    allowFree?: boolean;
};

export default function CurrencyFormatter(
    props: CurrencyFormatterProps
): JSX.Element {
    const { children, currency = null, allowFree = false } = props;
    const { country, language } = useTranslations();

    const countryConfig = useCountryConfig();
    const hiddenDecimal = !!countryConfig?.marketExceptions?.hiddenDecimal;
    const useGlobalFormatCurrency =
        !!countryConfig?.marketExceptions?.useGlobalFormatCurrency;
    const locale = ((): string => {
        if (!language || !country) return "en-US";
        if (useGlobalFormatCurrency) return "en-US";
        return `${language.toLowerCase()}-${country.toUpperCase()}`;
    })();

    if (children === undefined || children === null || children === "") {
        return <Spinner dark />;
    }

    const renderContent = (): JSX.Element => {
        const numericChildren =
            typeof children === "string"
                ? Number(children)
                : Number(String(children));
        if (Number.isNaN(numericChildren)) {
            return <Spinner dark />;
        }

        if (numericChildren === 0 && allowFree) {
            return <T>right_column_payment_shipping_price</T>;
        }

        const currentCurrency = currency || countryConfig?.currency || "USD";

        return (
            <>
                {Intl.NumberFormat(locale, {
                    style: "currency",
                    currency: currentCurrency,
                    minimumFractionDigits: hiddenDecimal ? 0 : 2,
                    maximumFractionDigits: hiddenDecimal ? 0 : 2
                }).format(numericChildren)}
            </>
        );
    };

    return renderContent();
}
