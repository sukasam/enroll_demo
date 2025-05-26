import { styledLogMessage } from "Services/utils/verboseLogger";
import httpTools from "Shared/httpTools.js";
import initDDC from "./worldPay";

// Mock the verboseLogger module
jest.mock("Services/utils/verboseLogger", () => ({
    styledLogMessage: jest.fn()
}));

// Mock the httpTools module
jest.mock("Shared/httpTools.js", () => ({
    sendRequest: jest.fn()
}));

describe("initDDC", () => {
    const mockCardNumber = "1234567890123456";
    const mockToken = "test-token";
    const mockDDCResponse = {
        ddcHTML: "<div>DDC HTML</div>",
        sessionId: "test-session-id"
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call httpTools.sendRequest with correct parameters and return the response", async () => {
        // Mock the httpTools.sendRequest to return a successful response
        (httpTools.sendRequest as jest.Mock).mockResolvedValue(mockDDCResponse);

        const result = await initDDC(mockCardNumber, mockToken);

        // Check if httpTools.sendRequest was called with correct parameters
        expect(httpTools.sendRequest).toHaveBeenCalledWith({
            method: "POST",
            url: "/ddc",
            token: mockToken,
            data: { bin: mockCardNumber }
        });

        // Check if the function returns the correct response
        expect(result).toEqual(mockDDCResponse);
    });

    it("should throw an error when httpTools.sendRequest fails", async () => {
        const mockError = new Error("Test error");
        (httpTools.sendRequest as jest.Mock).mockRejectedValue(mockError);

        await expect(initDDC(mockCardNumber, mockToken)).rejects.toThrow(
            "Test error"
        );

        expect(styledLogMessage).toHaveBeenCalledWith(
            "Making DDC call",
            "gray"
        );
        expect(styledLogMessage).toHaveBeenCalledTimes(1);
    });
});
