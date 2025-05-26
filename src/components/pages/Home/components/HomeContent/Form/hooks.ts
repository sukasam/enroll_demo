import showToast, {
    dismissAllErrorToasts
} from "Components/shared/ShowToaster";
import { getCountryConfig } from "Constants/countryConfig";
import { Alpha2 } from "Constants/countryConfig/enums";
import languages from "Constants/languages";
import { validateSponsor } from "Hydra/validateSponsor";
import { getFirstValidFullName, getFullName } from "Services/utils/fullName";
import isRefValid from "Services/utils/refValidation";
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

type CountryConfigLanguage = {
    name: string;
    code: string;
};

type AvailableLanguage = {
    label: string;
    value: string;
    defaultCountry: Alpha2;
};

export default function useAvailableLanguages(
    selectedCountry: Alpha2 | null
): AvailableLanguage[] {
    const [availableLanguages, setAvailableLanguages] =
        useState<AvailableLanguage[]>(languages);

    useEffect(() => {
        if (!selectedCountry) {
            setAvailableLanguages(languages);
            return;
        }

        const selectedCountryData = getCountryConfig(selectedCountry, true);
        const countryLanguages = selectedCountryData?.languages?.map(
            (language: CountryConfigLanguage) => ({
                label: language.name,
                value: language.code.toLowerCase(),
                defaultCountry: selectedCountry
            })
        );

        if (!countryLanguages) {
            setAvailableLanguages(languages);
            return;
        }

        setAvailableLanguages(countryLanguages);
    }, [selectedCountry]);

    return availableLanguages;
}

export const checkSponsor = async (
    sponsorId: string,
    enrollerId: string,
    setFormSponsorId: (sponsorId: string) => void,
    setFormSponsorFullName: (sponsorFullName: string) => void,
    setIsLoading: (isLoading: boolean) => void
): Promise<string | boolean> => {
    setIsLoading(true);
    const { isValid, unicityID, refResults } = await isRefValid(sponsorId);
    if (enrollerId === "") {
        return "home_enroller";
    }
    if (!isValid) {
        setFormSponsorFullName("");
        setIsLoading(false);
        return "error_invalid_sponsor";
    }

    const response = await validateSponsor({
        enroller: enrollerId,
        sponsor: unicityID
    });

    if (response.error) {
        setFormSponsorFullName("");
        setIsLoading(false);
        return "error_invalid_sponsor";
    }

    setFormSponsorId(sponsorId);
    setFormSponsorFullName(getFullName(refResults?.humanName));
    setIsLoading(false);
    return true;
};

export const checkRefID = async (
    enrollerId: string,
    setUnicityId: (enrollerId: string) => void,
    setFullName: (enrollerFullName: string) => void,
    setEnrollerAllFullName: (
        enrollerAllFullName: { firstName?: string; lastName?: string } | null
    ) => void,
    setIsLoading: (isLoading: boolean) => void,
    translate: (key: string) => string,
    hiddenEnrollerId?: boolean
): Promise<string | boolean> => {
    setIsLoading(true);
    try {
        const response = await isRefValid(enrollerId);
        const { isValid, refResults, unicityID } = response;

        if (!isValid) {
            setFullName("");
            setIsLoading(false);
            return hiddenEnrollerId
                ? "error_invalid_sponsor"
                : "error_invalid_referrer";
        }

        setUnicityId(unicityID);
        setEnrollerAllFullName(refResults?.humanName || null);
        setFullName(
            getFirstValidFullName([
                refResults?.preferredName,
                refResults?.humanName
            ])
        );
        setIsLoading(false);
        return true;
    } catch (error) {
        setFullName("");
        setIsLoading(false);
        dismissAllErrorToasts();
        showToast(translate("500_error_description"), "error");
        return "";
    }
};
