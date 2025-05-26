import httpTools from "Shared/httpTools.js";
import editAutoOrder from "./editAutoOrder";

jest.mock("Shared/httpTools.js");

describe("editAutoOrder", () => {
    const mockProps = {
        data: { someKey: "someValue" },
        id: "12345",
        hydraToken: "mock-hydra-token"
    };

    beforeEach(() => {
        jest.clearAllMocks();
        console.error = jest.fn(); // Mock console.error
    });

    it("should call sendRequest with correct parameters", async () => {
        await editAutoOrder(mockProps);

        expect(httpTools.sendRequest).toHaveBeenCalledWith({
            method: "PATCH",
            url: `/autoorders/${mockProps.id}`,
            token: mockProps.hydraToken,
            data: mockProps.data
        });
    });

    it("should not throw error if sendRequest is successful", async () => {
        httpTools.sendRequest.mockResolvedValue({});

        await expect(editAutoOrder(mockProps)).resolves.not.toThrow();
    });

    it("should log error if sendRequest fails", async () => {
        const mockError = new Error("API error");
        httpTools.sendRequest.mockRejectedValue(mockError);

        await editAutoOrder(mockProps);

        expect(console.error).toHaveBeenCalledWith(mockError);
    });

    it("should use the provided id in the URL", async () => {
        const customId = "custom-id-123";
        await editAutoOrder({ ...mockProps, id: customId });

        expect(httpTools.sendRequest).toHaveBeenCalledWith(
            expect.objectContaining({
                url: `/autoorders/${customId}`
            })
        );
    });
});
