import httpTools from "Shared/httpTools.js";
import addCreditCard from "./addCreditCard";

jest.mock("Shared/httpTools.js");

describe("addCreditCard", () => {
    const mockProps = {
        cardName: "testCard",
        data: { cardNumber: "1234567890123456", expiryDate: "12/25" },
        hydraToken: "mock-hydra-token"
    };

    beforeEach(() => {
        jest.clearAllMocks();
        console.error = jest.fn(); // Mock console.error
    });

    it("should call sendRequest with correct parameters", async () => {
        await addCreditCard(mockProps);

        expect(httpTools.sendRequest).toHaveBeenCalledWith({
            method: "POST",
            url: `/customers/me/creditcardaliases/${mockProps.cardName}`,
            token: mockProps.hydraToken,
            data: mockProps.data,
            logOptions: {
                requestName: "Add Credit Cards",
                response: true,
                error: true,
                functionName: "addCreditCard"
            }
        });
    });

    it("should not throw error if sendRequest is successful", async () => {
        httpTools.sendRequest.mockResolvedValue({});

        await expect(addCreditCard(mockProps)).resolves.not.toThrow();
    });

    it("should log error if sendRequest fails", async () => {
        const mockError = new Error("API error");
        httpTools.sendRequest.mockRejectedValue(mockError);

        await addCreditCard(mockProps);

        expect(console.error).toHaveBeenCalledWith(mockError);
    });
});
