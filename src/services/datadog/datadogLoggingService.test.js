import { datadogLogs } from "@datadog/browser-logs";
import {
    generateCurlCommand,
    initializeLoggingService,
    logRequestResponse
} from "./datadogLoggingService";

jest.mock("@datadog/browser-logs", () => ({
    datadogLogs: {
        init: jest.fn(),
        logger: {
            error: jest.fn(),
            log: jest.fn()
        }
    }
}));

jest.mock(
    "Root/package.json",
    () => ({
        version: "1.0.0"
    }),
    { virtual: true }
);

describe("datadogLoggingService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.NEXT_PUBLIC_LOGS_DATADOG_CLIENT_TOKEN = "test-token";
        process.env.NEXT_PUBLIC_DATADOG_ENV = "test";
    });

    describe("initializeLoggingService", () => {
        it("should initialize Datadog logs with correct parameters", () => {
            initializeLoggingService();
            expect(datadogLogs.init).toHaveBeenCalledWith({
                clientToken: "test-token",
                env: "test",
                service: "enrollment2.0",
                sessionSampleRate: 100,
                site: "us5.datadoghq.com",
                version: "1.0.0",
                forwardErrorsToLogs: false
            });
        });
    });

    describe("generateCurlCommand", () => {
        it("should generate a correct curl command", () => {
            const method = "POST";
            const url = "https://api.example.com/data";
            const headers = {
                "Content-Type": "application/json",
                Authorization: "Bearer token"
            };
            const requestData = { key: "value" };

            const result = generateCurlCommand(
                method,
                url,
                headers,
                requestData
            );
            expect(result).toBe(
                "curl -X POST 'https://api.example.com/data' -H 'Content-Type: application/json' -H 'Authorization: Bearer token' -d '{\"key\":\"value\"}'"
            );
        });

        it("should skip empty header keys", () => {
            const method = "GET";
            const url = "https://api.example.com/data";
            const headers = { "": "empty", Valid: "header" };
            const requestData = {};

            const result = generateCurlCommand(
                method,
                url,
                headers,
                requestData
            );
            expect(result).toBe(
                "curl -X GET 'https://api.example.com/data' -H 'Valid: header' -d '{}'"
            );
        });
    });

    describe("logRequestResponse", () => {
        it("should log an error for responses with status >= 400", () => {
            const logData = {
                request: { method: "GET", url: "https://api.example.com" },
                response: { status: 404, statusText: "Not Found" },
                curl: "curl -X GET https://api.example.com",
                requestName: "TestRequest",
                error: null
            };

            logRequestResponse(logData);

            expect(datadogLogs.logger.error).toHaveBeenCalledWith(
                "FAILED: TestRequest",
                expect.objectContaining({
                    ...logData,
                    timestamp: expect.any(String)
                })
            );
        });

        it("should log normally for responses with status < 400", () => {
            const logData = {
                request: { method: "GET", url: "https://api.example.com" },
                response: { status: 200, statusText: "OK" },
                curl: "curl -X GET https://api.example.com",
                requestName: "TestRequest",
                error: null
            };

            logRequestResponse(logData);

            expect(datadogLogs.logger.log).toHaveBeenCalledWith(
                "TestRequest",
                expect.objectContaining({
                    ...logData,
                    timestamp: expect.any(String)
                })
            );
        });
    });
});
