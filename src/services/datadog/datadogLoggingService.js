import { datadogLogs } from "@datadog/browser-logs";
import pkgJson from "Root/package.json";

let isLoggingInitialized = false;

export function initializeLoggingService() {
    if (isLoggingInitialized) {
        return;
    }

    datadogLogs.init({
        clientToken: process.env.NEXT_PUBLIC_LOGS_DATADOG_CLIENT_TOKEN || "",
        env: process.env.NEXT_PUBLIC_DATADOG_ENV,
        service: "enrollment2.0",
        sessionSampleRate: 100,
        site: "us5.datadoghq.com",
        version: pkgJson.version,
        forwardErrorsToLogs: false
    });

    isLoggingInitialized = true;
}

export function generateCurlCommand(method, url, headers, requestData) {
    let curlCommand = `curl -X ${method} '${url}'`;
    Object.entries(headers).forEach(([key, value]) => {
        if (key === "") {
            return;
        }
        curlCommand += ` -H '${key}: ${value}'`;
    });

    curlCommand += ` -d '${JSON.stringify(requestData)}'`;

    return curlCommand;
}

export function logRequestResponse({
    request,
    response,
    curl,
    requestName,
    error = null
}) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        request,
        response,
        requestName,
        error: error || null,
        curl
    };
    if (response.status >= 400) {
        return datadogLogs.logger.error(`FAILED: ${requestName}`, logEntry);
    }
    return datadogLogs.logger.log(requestName, { ...logEntry });
}

export function logError(error, requestName) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        requestName,
        error:
            typeof error === "object"
                ? JSON.stringify(error, null, 2)
                : String(error)
    };

    datadogLogs.logger.error(`FAILED: ${requestName}`, logEntry);
}
