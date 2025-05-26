import redactSensitiveDataFromLog from "Services/utils/redactSensitiveDataFromLog";
import {
    generateCurlCommand,
    logRequestResponse
} from "./datadogLoggingService";
import ddRequestLogger from "./ddRequestLogger";

// Mock the imported functions
jest.mock("Services/utils/redactSensitiveDataFromLog", () =>
    jest.fn(data => `redacted_${JSON.stringify(data)}`)
);
jest.mock("./datadogLoggingService", () => ({
    generateCurlCommand: jest.fn(() => "mocked curl command"),
    logRequestResponse: jest.fn()
}));

describe("ddRequestLogger", () => {
    const mockResponse = {
        headers: new Map([
            ["Content-Type", "application/json"],
            ["X-Request-ID", "12345"]
        ]),
        status: 200,
        ok: true
    };

    const mockParams = {
        logOptions: {
            requestName: "TestRequest",
            functionName: "testFunction"
        },
        method: "POST",
        requestData: { sensitive: "data" },
        requestHeaders: { "Content-Type": "application/json" },
        requestUrl: "https://api.example.com/test",
        response: mockResponse,
        responseData: { result: "success" }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should not log if requestName is not provided", () => {
        ddRequestLogger({ ...mockParams, logOptions: {} });
        expect(logRequestResponse).not.toHaveBeenCalled();
    });

    it("should log request and response data correctly", () => {
        ddRequestLogger(mockParams);

        expect(redactSensitiveDataFromLog).toHaveBeenCalledTimes(2);
        expect(generateCurlCommand).toHaveBeenCalledWith(
            "POST",
            "https://api.example.com/test",
            { "Content-Type": "application/json" },
            'redacted_{"sensitive":"data"}'
        );

        expect(logRequestResponse).toHaveBeenCalledWith({
            request: {
                method: "POST",
                url: "https://api.example.com/test",
                headers: { "Content-Type": "application/json" },
                data: 'redacted_{"sensitive":"data"}'
            },
            response: {
                headers: {
                    "Content-Type": "application/json",
                    "X-Request-ID": "12345"
                },
                status: 200,
                data: 'redacted_{"result":"success"}'
            },
            functionName: "testFunction",
            curl: "mocked curl command",
            error: null,
            requestName: "TestRequest"
        });
    });

    it("should set error in logEntry when response is not ok", () => {
        const notOkResponse = { ...mockResponse, ok: false };
        ddRequestLogger({ ...mockParams, response: notOkResponse });

        expect(logRequestResponse).toHaveBeenCalledWith(
            expect.objectContaining({
                error: notOkResponse
            })
        );
    });
});
