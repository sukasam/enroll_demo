import { countryConfigs } from "Constants/countryConfig";
import { Alpha2, Alpha3 } from "Constants/countryConfig/enums";
import { useRouter } from "next/router";
import { useMemo } from "react";

type Locale = `${string}-${string}`;

export const toAlpha3 = (alpha2: Alpha2): Alpha3 => {
    const countries = countryConfigs.find(
        config => config.alpha2 === alpha2?.toUpperCase()
    );

    return countries?.alpha3 ?? Alpha3.USA;
};

export const toAlpha2 = (alpha3: Alpha3): Alpha2 => {
    const countries = countryConfigs.find(
        config => config.alpha3 === alpha3?.toUpperCase()
    );
    return countries?.alpha2 ?? Alpha2.US;
};

export const routerPropToAlpha2 = (alpha3: string | string[]): Alpha2 => {
    const _alpha3 = Array.isArray(alpha3) ? alpha3[0] : alpha3;
    return toAlpha2(_alpha3?.toUpperCase() as Alpha3);
};

export const isSupportedRawAlpha3 = (alpha3: string): boolean =>
    countryConfigs.some(config => config.alpha3 === alpha3?.toUpperCase());

type FormatLocaleProps = {
    language: string;
    alpha2?: Alpha2;
    alpha3?: Alpha3;
};

export const formatLocale = (props: FormatLocaleProps): Locale => {
    const { alpha2, alpha3, language } = props;

    if (!alpha3 && !alpha2) {
        throw new Error("Either alpha2 or alpha3 must be provided");
    }

    const _alpha2 = alpha2 ?? toAlpha2(alpha3 as Alpha3);

    return `${language}-${_alpha2}`;
};

export const getShipToCountryWithExceptions = (alpha2: Alpha2): Alpha2 =>
    alpha2 === Alpha2.PR ? Alpha2.US : alpha2;

export default {
    formatLocale,
    toAlpha3,
    toAlpha2
};

export function useAlpha2(): Alpha2 {
    const {
        query: { alpha3 }
    } = useRouter();

    const alpha2 = useMemo(
        () => routerPropToAlpha2(alpha3 as Alpha3),
        [alpha3]
    );

    return alpha2;
}
