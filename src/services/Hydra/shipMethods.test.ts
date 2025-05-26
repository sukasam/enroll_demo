import { Alpha2 } from "Constants/countryConfig/enums";
import httpTools from "Shared/httpTools.js";
import getShipMethods from "./shipMethods";

jest.mock("Shared/httpTools.js", () => ({
    sendRequest: jest.fn()
}));

describe("getShipMethods", () => {
    const mockResponse = {
        items: [
            { location: "Location1", market: "US" as Alpha2, type: "Type1" },
            { location: "Location2", market: "US" as Alpha2, type: "Type2" }
        ]
    };

    beforeEach(() => {
        (httpTools.sendRequest as jest.Mock).mockClear();
    });

    it("calls sendRequest with correct parameters for non-PR state", async () => {
        await getShipMethods({ alpha2: Alpha2.US });

        expect(httpTools.sendRequest).toHaveBeenCalledWith({
            method: "GET",
            url: "/shippingmethods.json?market=US",
            withAuth: false,
            logOptions: {
                requestName: "Get Shipping Methods",
                error: true,
                functionName: "getShipMethods"
            }
        });
    });

    it("calls sendRequest with correct parameters for PR state", async () => {
        await getShipMethods({ alpha2: Alpha2.US, state: "PR" });

        expect(httpTools.sendRequest).toHaveBeenCalledWith({
            method: "GET",
            url: "/shippingmethods.json?market=PR",
            withAuth: false,
            logOptions: {
                requestName: "Get Shipping Methods",
                error: true,
                functionName: "getShipMethods"
            }
        });
    });

    it("returns the result of sendRequest", async () => {
        (httpTools.sendRequest as jest.Mock).mockResolvedValue(mockResponse);

        const result = await getShipMethods({ alpha2: Alpha2.US });

        expect(result).toEqual(mockResponse);
    });
});
