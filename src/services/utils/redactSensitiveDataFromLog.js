import { getCookie } from "cookies-next";

export default function redactSensitiveDataFromLog(data) {
    if (!data) {
        return {};
    }
    const keysToRedact = [
        "password",
        "recaptchaToken",
        "creditCardNumber",
        "creditCardSecurityCode",
        "creditCardExpires"
    ];

    const isCookieEnabled = getCookie("isCookieEnabled") === "true";

    if (isCookieEnabled) {
        keysToRedact.push("firstName", "lastName", "email");
    }

    try {
        let jsonString = typeof data === "string" ? data : JSON.stringify(data);
        keysToRedact.forEach(key => {
            const regex = new RegExp(
                `"${key}":\\s*(".*?"|\\{[^}]*\\}|[^,}\\]]+)`,
                "g"
            );
            jsonString = jsonString?.replace(
                regex,
                `"${key}":"[sensitive_data]"`
            );
        });

        const methodDetailsRegex = /"methodDetails":\s*\{[^}]*\}/g;
        jsonString = jsonString?.replace(methodDetailsRegex, match => {
            keysToRedact.forEach(key => {
                const nestedRegex = new RegExp(
                    `"${key}":\\s*(".*?"|\\{[^}]*\\}|[^,}\\]]+)`,
                    "g"
                );
                match = match?.replace(
                    nestedRegex,
                    `"${key}":"[sensitive_data]"`
                );
            });
            return match;
        });

        return JSON.parse(jsonString);
    } catch (error) {
        console.error(error);
        return { message: "issue with redacting data", error };
    }
}
