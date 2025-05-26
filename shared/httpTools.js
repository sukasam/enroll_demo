import ddRequestLogger from "Services/datadog/ddRequestLogger";
import CustomError from "Services/utils/customError";
import { getCookie } from "cookies-next";

const HYDRA_NO_PROD =
    process.env.NEXT_PUBLIC_HYDRA_NO_PROD_BASE_URL || "hydraqa";
const HYDRA_PROD = "hydra";
const LIVE_OVERRIDE = parseInt(process.env.NEXT_PUBLIC_LIVE_OVERRIDE, 10);

const createQueryString = ({ queryParams }) => {
    if (!queryParams) {
        return "";
    }

    const params = new URLSearchParams();

    Object.entries(queryParams).forEach(([key, value]) => {
        if (value) {
            params.append(key, value);
        }
    });

    return `?${params}`;
};

const httpTools = {
    isProd: process.env.NEXT_PUBLIC_APP_ENV === "production",
    isLocal: process.env.NEXT_PUBLIC_APP_ENV === "localhost",
    isDev: process.env.NEXT_PUBLIC_APP_ENV === "development",
    getHydraAPIUrl: () => {
        if (httpTools.isLocal) {
            return `https://${
                LIVE_OVERRIDE ? HYDRA_PROD : HYDRA_NO_PROD
            }.unicity.net`;
        }
        return `https://${
            httpTools.isDev && !LIVE_OVERRIDE ? HYDRA_NO_PROD : HYDRA_PROD
        }.unicity.net`;
    },
    getCdnUrl: () => "https://cdn.unicity.com/config",
    getJsonHeaders: ({ withAuth, token }) => {
        const isTestCase = getCookie("autobots");
        const headers = {
            "Content-Type": "application/json",
            "x-application": isTestCase ? "enroll.automation" : "enroll"
        };
        if (withAuth) {
            headers.Authorization = `Bearer ${token}`;
        }
        return headers;
    },
    sendRequest: async ({
        method = "GET",
        baseURL = httpTools.envUrl(),
        queryParams,
        url,
        data,
        token = "",
        withAuth = true,
        headers = {},
        returnType = "json",
        logOptions = {},
        throwError = false,
        isErrorMessageOverride = false
    }) => {
        baseURL = baseURL === "internal" ? "" : baseURL;
        baseURL =
            baseURL === "jeeves"
                ? `https://jeeves.unicity${httpTools.isProd ? "" : "qa"}.com`
                : baseURL;
        const query = createQueryString({ queryParams });

        const requestUrl = `${baseURL}${url}${query}`;
        const requestData = JSON.stringify(data);
        const requestHeaders = {
            ...headers,
            ...httpTools.getJsonHeaders({ withAuth, token })
        };

        const response = await fetch(requestUrl, {
            method,
            body: requestData,
            headers: requestHeaders
        });

        if (!response.ok && throwError) {
            const errorResponse = await response.json();

            if (response.status >= 400 && response.status < 500) {
                ddRequestLogger({
                    logOptions,
                    method,
                    requestData,
                    requestHeaders,
                    requestUrl,
                    response,
                    responseData: errorResponse
                });

                throw new CustomError({
                    code: response.status,
                    error_code: errorResponse.error.error_code,
                    message: isErrorMessageOverride
                        ? errorResponse.error.error_message
                        : errorResponse.error.message
                });
            }
            if (response.status >= 500) {
                ddRequestLogger({
                    logOptions,
                    method,
                    requestData,
                    requestHeaders,
                    requestUrl,
                    response,
                    responseData: errorResponse
                });

                throw new CustomError({
                    code: response.status,
                    message: "500_error_description"
                });
            }
        }
        if (!response.ok) {
            return response;
        }

        if (returnType === "json") {
            const responseData = await response.json();
            ddRequestLogger({
                logOptions,
                method,
                requestData,
                requestHeaders,
                requestUrl,
                response,
                responseData
            });
            return responseData;
        }

        if (returnType === "response") {
            return response;
        }

        return null;
    },
    createParamString: params => {
        const urlParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value != null && value !== "") {
                urlParams.append(key, value);
            }
        });
        const paramString = urlParams.toString();
        return paramString ? `?${paramString}` : "";
    },
    envUrl: () => `${httpTools.getHydraAPIUrl()}/${httpTools.envFlags()}`,
    envFlags() {
        // build out domain checking to return correct apiUrl
        if (httpTools.isProd || LIVE_OVERRIDE) {
            return "v5a";
        }
        return "v5a-test";
    }
};

export default httpTools;
