import httpTools from "Shared/httpTools";

export const translationsSvc = {
    // Use this function to hit the /api/translations endpoint this will avoid CORS issues
    get: ({ country = "US", language = "en" }) => {
        const req = {
            url: `/api/translations?country=${country}&language=${language}`,
            withAuth: false,
            baseURL: "internal",
            headers: {
                "Accept-Language": `${language}-${country}`
            }
        };
        return httpTools.sendRequest(req);
    },
    // Use this function to get the Translations directly (faster but may have CORS issues)
    getDirect: ({ country = "US", language = "en" }) => {
        const reqURL =
            process.env.NEXT_PUBLIC_APP_ENV === "production"
                ? "https://cdn.unicity.com/translations/enroll/"
                : "https://cdn.unicity.com/translations/qa/enroll/";
        const req = {
            url: `${reqURL}${language}-${country}.json`,
            withAuth: false,
            baseURL: "internal",
            headers: {
                "Accept-Language": `${language}-${country}`
            }
        };
        return httpTools.sendRequest(req);
    }
};

export default translationsSvc;
