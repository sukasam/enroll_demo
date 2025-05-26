import { useCountryConfig } from "Constants/countryConfig";
import { getCookie } from "cookies-next";
import { useMemo } from "react";

export default function useAllowGuide(): boolean {
    const countryConfig = useCountryConfig();

    return useMemo(() => {
        const alwaysShowGuide = countryConfig?.alwaysShowGuide ?? false;
        const allowGuideFromCookie = getCookie("allowGuide") === "true";
        return alwaysShowGuide || allowGuideFromCookie;
    }, [countryConfig]);
}
