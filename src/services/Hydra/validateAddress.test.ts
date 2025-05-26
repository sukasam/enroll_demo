import httpTools from "Shared/httpTools.js";
import { validateAddress } from "./validateAddress";

jest.mock("Shared/httpTools.js", () => ({
    sendRequest: jest.fn()
}));

describe("validateAddress", () => {
    const mockParams = {
        address1: "123 Main St",
        city: "Anytown",
        zip: "12345",
        country: "USA"
    };

    it("calls sendRequest with correct parameters", async () => {
        await validateAddress(mockParams);

        expect(httpTools.sendRequest).toHaveBeenCalledWith({
            method: "GET",
            url: "/addresses",
            withAuth: false,
            queryParams: mockParams
        });
    });

    it("returns the result of sendRequest", async () => {
        const mockResponse = {
            items: [
                {
                    address1: "123 Main St",
                    address2: "",
                    city: "Anytown",
                    state: "ST",
                    zip: "12345",
                    country: "USA"
                }
            ]
        };
        (httpTools.sendRequest as jest.Mock).mockResolvedValue(mockResponse);

        const result = await validateAddress(mockParams);

        expect(result).toEqual(mockResponse);
    });

    it("handles optional parameters", async () => {
        const paramsWithOptional = {
            ...mockParams,
            address2: "Apt 4B",
            state: "ST"
        };

        await validateAddress(paramsWithOptional);

        expect(httpTools.sendRequest).toHaveBeenCalledWith({
            method: "GET",
            url: "/addresses",
            withAuth: false,
            queryParams: paramsWithOptional
        });
    });
});
