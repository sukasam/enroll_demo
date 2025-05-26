import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

interface ConsentData {
    [key: string]: string;
}

const useConsent = (): ConsentData | null => {
    const [consentData, setConsentData] = useState<ConsentData | null>(null);

    useEffect(() => {
        const cookieYes = getCookie("cookieyes-consent");

        if (cookieYes) {
            const jsonString = `{${cookieYes
                .split(",")
                .map(part => {
                    const [key, value] = part.split(":");
                    return `"${key.trim()}":"${value.trim()}"`;
                })
                .join(",")}}`;

            try {
                const jsonObject = JSON.parse(jsonString);
                setConsentData(jsonObject);
            } catch (error) {
                console.error("Failed to parse JSON:", error);
            }
        } else {
            // console.log("Cookie is undefined or empty");
        }
    }, []);

    return consentData;
};

export default useConsent;
