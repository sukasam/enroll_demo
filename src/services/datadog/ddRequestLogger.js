import redactSensitiveDataFromLog from "Services/utils/redactSensitiveDataFromLog";
import {
    generateCurlCommand,
    logRequestResponse
} from "./datadogLoggingService";

const ddRequestLogger = ({
    logOptions,
    method,
    requestData,
    requestHeaders,
    requestUrl,
    response,
    responseData
}) => {
    if (logOptions.requestName) {
        const responseHeaders = {};

        response.headers.forEach((value, name) => {
            responseHeaders[name] = value;
        });

        const redactedRequestData = redactSensitiveDataFromLog(requestData);
        const redactedResponseData = redactSensitiveDataFromLog(responseData);

        const logRequest = {
            method,
            url: requestUrl,
            headers: requestHeaders,
            data: redactedRequestData
        };

        const logResponse = {
            headers: responseHeaders,
            status: response.status,
            data: redactedResponseData
        };

        const curlCommand = generateCurlCommand(
            method,
            requestUrl,
            requestHeaders,
            redactedRequestData
        );

        const logEntry = {
            request: logRequest,
            response: logResponse,
            functionName: logOptions.functionName,
            curl: curlCommand,
            error: !response.ok ? response : null,
            requestName: logOptions.requestName
        };
        logRequestResponse(logEntry);
    }
};

export default ddRequestLogger;
