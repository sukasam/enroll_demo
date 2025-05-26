import httpTools from "Shared/httpTools.js";
import { validateSponsor } from "./validateSponsor";

jest.mock("Shared/httpTools.js", () => ({
    envUrl: jest.fn(() => "https://api.example.com"),
    sendRequest: jest.fn()
}));

describe("validateSponsor", () => {
    it("calls sendRequest with correct parameters", async () => {
        const enroller = "12345";
        const sponsor = "67890";

        await validateSponsor({ enroller, sponsor });

        expect(httpTools.sendRequest).toHaveBeenCalledWith({
            method: "POST",
            url: "/orders/dryrun",
            withAuth: false,
            data: {
                customer: {
                    enroller: {
                        href: "https://api.example.com/customers?id.unicity=12345"
                    },
                    sponsor: {
                        href: "https://api.example.com/customers?id.unicity=67890"
                    }
                }
            }
        });
    });

    it("returns the result of sendRequest", async () => {
        const mockResponse = { success: true };
        httpTools.sendRequest.mockResolvedValue(mockResponse);

        const result = await validateSponsor({
            enroller: "12345",
            sponsor: "67890"
        });

        expect(result).toBe(mockResponse);
    });
});
