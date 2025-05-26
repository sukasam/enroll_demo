import httpTools from "Shared/httpTools.js";
import upgradeCustomerWithoutPurchase, {
    UpgradeCustomerDataPatch,
    UpgradeCustomerDataPost
} from "./upgradeCustomerWithoutPurchase";

jest.mock("Shared/httpTools.js", () => ({
    sendRequest: jest.fn()
}));

describe("upgradeCustomerWithoutPurchase", () => {
    const mockCustomerDataPost: UpgradeCustomerDataPost = {
        taxTerms: { taxId: "TAX123" },
        identification: { documentId: "123", documentType: "passport" },
        mainAddress: {
            city: "City",
            country: "Country",
            zip: "12345",
            address1: "123 Main St",
            address2: "Apt 4",
            state: "State"
        }
    };
    const mockCustomerDataPatch: UpgradeCustomerDataPatch = {
        status: "active",
        type: "Associate",
        signature: { value: "signature" }
    };

    const mockCustomerHref = "customer123";
    const mockUserToken = "token123";

    describe("UpdateCustomerDataWithoutPurchase_Post", () => {
        it("calls sendRequest with correct parameters", async () => {
            await upgradeCustomerWithoutPurchase(
                mockCustomerDataPost,
                mockCustomerHref,
                mockUserToken,
                "POST"
            );

            expect(httpTools.sendRequest).toHaveBeenCalledWith({
                method: "POST",
                url: "/customers/customer123",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                },
                token: mockUserToken,
                data: mockCustomerDataPost,
                throwError: true,
                isErrorMessageOverride: true,
                withAuth: true
            });
        });

        it("returns the result of sendRequest", async () => {
            const mockResponse = { success: true };
            (httpTools.sendRequest as jest.Mock).mockResolvedValue(
                mockResponse
            );

            const result = await upgradeCustomerWithoutPurchase(
                mockCustomerDataPost,
                mockCustomerHref,
                mockUserToken,
                "POST"
            );

            expect(result).toBe(mockResponse);
        });
    });

    describe("upgradeCustomerWithoutPurchase_Patch", () => {
        it("calls sendRequest with correct parameters", async () => {
            await upgradeCustomerWithoutPurchase(
                mockCustomerDataPatch,
                mockCustomerHref,
                mockUserToken,
                "PATCH"
            );

            expect(httpTools.sendRequest).toHaveBeenCalledWith({
                method: "PATCH",
                url: "/customers/customer123",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                },
                token: mockUserToken,
                data: mockCustomerDataPatch,
                throwError: true,
                isErrorMessageOverride: true,
                withAuth: true
            });
        });

        it("returns the result of sendRequest", async () => {
            const mockResponse = { success: true };
            (httpTools.sendRequest as jest.Mock).mockResolvedValue(
                mockResponse
            );

            const result = await upgradeCustomerWithoutPurchase(
                mockCustomerDataPatch,
                mockCustomerHref,
                mockUserToken,
                "PATCH"
            );

            expect(result).toBe(mockResponse);
        });
    });
});
