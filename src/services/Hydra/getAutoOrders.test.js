import httpTools from "Shared/httpTools.js";
import getAutoOrders from "./getAutoOrders";

jest.mock("Shared/httpTools.js");

describe("getAutoOrders", () => {
    const mockHydraToken = "mock-hydra-token";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call sendRequest with correct parameters", async () => {
        await getAutoOrders({ hydraToken: mockHydraToken });

        expect(httpTools.sendRequest).toHaveBeenCalledWith({
            method: "GET",
            url: "/customers/me/autoorders",
            token: mockHydraToken
        });
    });

    it("should return the result from sendRequest", async () => {
        const mockAutoOrders = [{ id: "1", name: "Auto Order 1" }];
        httpTools.sendRequest.mockResolvedValue(mockAutoOrders);

        const result = await getAutoOrders({ hydraToken: mockHydraToken });

        expect(result).toEqual(mockAutoOrders);
    });

    it("should throw an error if sendRequest fails", async () => {
        const mockError = new Error("API error");
        httpTools.sendRequest.mockRejectedValue(mockError);

        await expect(
            getAutoOrders({ hydraToken: mockHydraToken })
        ).rejects.toThrow("API error");
    });
});
