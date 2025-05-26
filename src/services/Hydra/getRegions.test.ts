import { Alpha2 } from "Constants/countryConfig/enums";
import httpTools from "Shared/httpTools.js";
import getRegions from "./getRegions";

jest.mock("Shared/httpTools.js");

describe("getRegions", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("calls sendRequest with correct parameters", async () => {
        const mockResponse = { items: [{ name: "California", value: "CA" }] };
        (httpTools.sendRequest as jest.Mock).mockResolvedValue(mockResponse);

        const result = await getRegions(Alpha2.US);

        expect(httpTools.sendRequest).toHaveBeenCalledWith({
            method: "GET",
            url: "/countries/US/regions.json",
            withAuth: false,
            logOptions: {
                requestName: "Get Regions",
                error: true,
                functionName: "getRegions"
            }
        });
        expect(result).toEqual(mockResponse);
    });

    it("handles errors correctly", async () => {
        const mockError = { error: "Network error" };
        (httpTools.sendRequest as jest.Mock).mockRejectedValue(mockError);

        await expect(getRegions(Alpha2.CA)).rejects.toEqual(mockError);
    });
});
