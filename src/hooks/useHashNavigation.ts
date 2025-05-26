import { getValidatedLocale } from "Constants/countryConfig";
import { Locale } from "Constants/countryConfig/types";
import { useTranslations } from "Contexts/translation";
import { useUser } from "Contexts/UserContext";
import { setCookie } from "cookies-next";
import { useEffect, useState } from "react";
import getRefID, { Response as RefIDResponse } from "Services/Hydra/getRefID";
import { getFullName } from "Services/utils/fullName";

interface HashData extends Locale {
    refId: string | null;
}

export default function useHashNavigation(): { isHashProcessed: boolean } {
    const [isHashProcessed, setIsHashProcessed] = useState(false);
    const { setCountry, setLanguage } = useTranslations();
    const {
        setEnrollerId,
        setEnrollerFullName,
        setSponsorId,
        setSponsorFullName
    } = useUser();

    const parseHashData = (hashPath: string): HashData => {
        const parts = hashPath.split("/").filter(Boolean);

        // Default values
        const defaultData: HashData = {
            countryCode: null,
            language: null,
            refId: null
        };

        // Check if it's an enrollment path
        if (parts[0] !== "enroll" || parts[1] !== "start") {
            return defaultData;
        }

        // Handle different path patterns
        switch (parts.length) {
            case 2: // /enroll/start
                return defaultData;

            case 3: // /enroll/start/pr
                return {
                    ...defaultData,
                    ...getValidatedLocale(parts[2].toUpperCase(), null)
                };

            case 4: // /enroll/start/pr/36554001
                return {
                    ...defaultData,
                    ...getValidatedLocale(parts[2].toUpperCase(), null),
                    refId: parts[3]
                };

            case 5: {
                // /enroll/start/MX/36554001/es_MX
                const rawLanguage = parts[4].split("_")[0];
                return {
                    ...defaultData,
                    ...getValidatedLocale(parts[2].toUpperCase(), rawLanguage),
                    refId: parts[3]
                };
            }

            default:
                return defaultData;
        }
    };

    const handleLocaleData = (
        countryCode: string | null,
        language: string | null
    ): void => {
        if (countryCode) {
            setCountry(countryCode);
            // setCookie("country", countryCode);
        }
        if (language) {
            // setCookie("language", language);
            setLanguage(language);
        }
    };

    const handleReferralData = async (
        refId: string | null,
        countryCode: string | null,
        language: string | null
    ): Promise<void> => {
        if (!refId) return;

        // Set cookie
        setCookie("refId", refId);

        // Set context state
        setEnrollerId(refId);
        setSponsorId(refId);

        try {
            const response: RefIDResponse = await getRefID({
                country: countryCode || "US", // Fallback to US if no country
                language: language || "en", // Fallback to en if no language
                refID: refId
            });

            if (response.items?.[0]?.humanName) {
                const fullName = getFullName(response.items[0].humanName);
                setEnrollerFullName(fullName);
                setSponsorFullName(fullName);
            }
        } catch (error) {
            console.error("Failed to fetch referee details:", error);
        }
    };
    const processHash = async (): Promise<void> => {
        if (typeof window !== "undefined" && window.location.hash) {
            const hashPath = window.location.hash.substring(1);
            const hashData = parseHashData(hashPath);
            // Handle locale first
            handleLocaleData(hashData.countryCode, hashData.language);

            // Then handle referral
            await handleReferralData(
                hashData.refId,
                hashData.countryCode,
                hashData.language
            );

            // Remove the hash without causing a page reload
            window.history.replaceState(
                null,
                document.title,
                window.location.pathname + window.location.search
            );
        }
        setIsHashProcessed(true);
    };

    useEffect(() => {
        processHash();
    }, []); // Only run once on mount

    return { isHashProcessed };
}
