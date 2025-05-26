import httpTools from "Shared/httpTools";
import getRefID, { Response } from "./getRefID";

jest.mock("Shared/httpTools");

describe("getRefID", () => {
    const mockParams = {
        country: "US",
        language: "en",
        refID: "12345"
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("calls sendRequest with correct parameters", async () => {
        const mockResponse: Response = { items: [], ok: true };
        (httpTools.sendRequest as jest.Mock).mockResolvedValue(mockResponse);

        const result = await getRefID(mockParams);

        expect(httpTools.sendRequest).toHaveBeenCalledWith({
            method: "GET",
            url: "/customers?referralCode=12345&expand=customer,preferredName",
            headers: {
                "Accept-Language": "en-US"
            },
            withAuth: false
        });
        expect(result).toEqual(mockResponse);
    });

    it("handles different country and language", async () => {
        await getRefID({ ...mockParams, country: "FR", language: "fr" });

        expect(httpTools.sendRequest).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: {
                    "Accept-Language": "fr-FR"
                }
            })
        );
    });

    it("handles errors correctly", async () => {
        const mockError = new Error("Network error");
        (httpTools.sendRequest as jest.Mock).mockRejectedValue(mockError);

        await expect(getRefID(mockParams)).rejects.toThrow("Network error");
    });
});
