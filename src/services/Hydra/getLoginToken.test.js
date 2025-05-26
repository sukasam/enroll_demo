import httpTools from "Shared/httpTools";
import getLoginToken from "./getLoginToken";

jest.mock("Shared/httpTools");

describe("getLoginToken", () => {
    const mockEnvUrl = "https://test-env.com";
    const username = "testuser";
    const password = "testpass";
    const recaptcha = "recaptcha-token";

    beforeEach(() => {
        jest.clearAllMocks();
        httpTools.envUrl.mockReturnValue(mockEnvUrl);
        global.btoa = jest.fn().mockReturnValue("base64-encoded");
    });

    it("should call sendRequest with correct parameters without recaptcha", async () => {
        await getLoginToken(username, password);

        expect(httpTools.sendRequest).toHaveBeenCalledWith({
            method: "POST",
            data: {
                type: "base64",
                value: "base64-encoded",
                namespace: `${mockEnvUrl}/customers`
            },
            headers: {},
            url: "/loginTokens",
            withAuth: false,
            logOptions: {
                requestName: "Get Login Token",
                error: true,
                functionName: "getLoginToken"
            },
            throwError: true
        });
    });

    it("should include recaptcha data when provided", async () => {
        await getLoginToken(username, password, recaptcha);

        expect(httpTools.sendRequest).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    recaptchaToken: recaptcha,
                    recaptchaType: "invisible"
                }),
                headers: {
                    "x-enable-recaptcha": "true"
                }
            })
        );
    });

    it("should return the result from sendRequest", async () => {
        const mockToken = "mock-login-token";
        httpTools.sendRequest.mockResolvedValue(mockToken);

        const result = await getLoginToken(username, password);

        expect(result).toBe(mockToken);
    });

    it("should use btoa to encode username and password", async () => {
        await getLoginToken(username, password);

        expect(global.btoa).toHaveBeenCalledWith(`${username}:${password}`);
    });
});
