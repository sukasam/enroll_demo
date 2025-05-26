import httpTools from "Shared/httpTools.js";
import checkEmailExist from "./checkEmailExist";

jest.mock("Shared/httpTools.js");

describe("checkEmailExist", () => {
    const testEmail = "test@example.com";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call sendRequest with correct parameters", async () => {
        const mockResponse = { status: 200 };
        httpTools.sendRequest.mockResolvedValue(mockResponse);

        await checkEmailExist({ email: testEmail });

        expect(httpTools.sendRequest).toHaveBeenCalledWith({
            method: "HEAD",
            url: `/customers?email=${encodeURIComponent(testEmail)}`,
            withAuth: false,
            returnType: "response"
        });
    });

    it("should properly encode the email in the URL", async () => {
        const emailWithSpecialChars = "test+user@example.com";
        const mockResponse = { status: 200 };
        httpTools.sendRequest.mockResolvedValue(mockResponse);

        await checkEmailExist({ email: emailWithSpecialChars });

        expect(httpTools.sendRequest).toHaveBeenCalledWith(
            expect.objectContaining({
                url: `/customers?email=${encodeURIComponent(
                    emailWithSpecialChars
                )}`
            })
        );
    });

    it("should return the result from sendRequest", async () => {
        const mockResponse = { status: 200 };
        httpTools.sendRequest.mockResolvedValue(mockResponse);

        const result = await checkEmailExist({ email: testEmail });

        expect(result).toEqual({ status: 200, exists: true });
    });

    it("should pass through any errors from sendRequest", async () => {
        const mockError = new Error("Network error");
        httpTools.sendRequest.mockRejectedValue(mockError);

        await expect(checkEmailExist({ email: testEmail })).rejects.toThrow(
            "Network error"
        );
    });
});
