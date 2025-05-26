import httpTools from "Shared/httpTools.js";
import getPayPalToken from "./getPayPalToken";

jest.mock("Shared/httpTools.js");

describe("getPayPalToken", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        httpTools.envUrl.mockReturnValue("https://test-env.com");
    });

    it("should call sendRequest with correct parameters", async () => {
        const market = "US";
        await getPayPalToken({ market });

        expect(httpTools.sendRequest).toHaveBeenCalledWith({
            method: "POST",
            url: `/clientTokens?market=${market}`,
            data: {
                namespace: "https://test-env.com/transactions",
                type: "jwt",
                client: "PayPal"
            },
            withAuth: false
        });
    });

    it("should return the result from sendRequest", async () => {
        const mockToken = "mock-paypal-token";
        httpTools.sendRequest.mockResolvedValue(mockToken);

        const result = await getPayPalToken({ market: "CA" });

        expect(result).toBe(mockToken);
    });

    it("should use the provided market in the URL", async () => {
        const market = "UK";
        await getPayPalToken({ market });

        expect(httpTools.sendRequest).toHaveBeenCalledWith(
            expect.objectContaining({
                url: `/clientTokens?market=${market}`
            })
        );
    });
});
