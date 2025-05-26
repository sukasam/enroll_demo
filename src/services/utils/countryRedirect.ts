import { getCountryConfig, isSupported } from "Constants/countryConfig";
import { Alpha2 } from "Constants/countryConfig/enums";
import httpTools from "Shared/httpTools";

function countryRedirect(
    country: Alpha2,
    fallbackLanguage: string,
    origin: string,
    referral: string
): {
    isInternal: boolean;
    path: string | null;
} {
    const selectedCountryData = getCountryConfig(country, false);

    // Edge case, should not be needed
    if (!selectedCountryData) {
        let path = `${origin}/home`;

        if (referral) {
            path += `/${referral}`;
        }

        return {
            isInternal: true,
            path
        };
    }

    const languageCode =
        selectedCountryData.languages.find(_language => _language.default)
            ?.code ?? fallbackLanguage;

    if (!isSupported(selectedCountryData)) {
        if (selectedCountryData.redirect?.includes("ushop-link")) {
            return {
                isInternal: false,
                path: `${selectedCountryData.redirect}/${referral}`
            };
        }
        if (selectedCountryData.redirect) {
            return {
                isInternal: false,
                path: selectedCountryData.redirect
            };
        }

        let path = `${
            httpTools.isProd
                ? "https://enroll.unicity.com"
                : "http://enroll.ng.unicityqa.com/master"
        }/#/enroll/start/${selectedCountryData.alpha2.toUpperCase()}`;

        if (referral) {
            path += `/${referral}`;
        }

        path += `/${languageCode}_${selectedCountryData.alpha2}`;

        return {
            isInternal: false,
            path
        };
    }

    let path = `${origin}/${selectedCountryData.alpha3.toLowerCase()}/${languageCode}/home`;

    if (referral) {
        path += `/${referral}`;
    }

    return {
        isInternal: true,
        path: null
    };
}

export default countryRedirect;
