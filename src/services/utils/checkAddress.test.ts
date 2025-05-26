import { Alpha2 } from "Constants/countryConfig/enums";
import validateAddressWithQuotes from "Hydra/quotesAddressValidation";
import getShipMethods from "Hydra/shipMethods";
import checkAddress from "./checkAddress";

jest.mock("Hydra/quotesAddressValidation");
jest.mock("Hydra/shipMethods");

describe("checkAddress", () => {
    const mockProps = {
        setInvalidAddress: jest.fn(),
        setOutOfStockError: jest.fn(),
        values: {
            address1: "123 Test St",
            city: "TestCity",
            country: "US" as Alpha2,
            zip: "12345",
            state: "TestState"
        },
        sku: "TEST123"
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return true for valid address", async () => {
        (getShipMethods as jest.Mock).mockResolvedValue({
            items: [{ type: "STANDARD" }]
        });
        (validateAddressWithQuotes as jest.Mock).mockResolvedValue({
            items: [{}]
        });

        const result = await checkAddress(mockProps);
        expect(result).toBe(true);
    });

    it("should return false and call setOutOfStockError for error code 4009", async () => {
        (getShipMethods as jest.Mock).mockResolvedValue({
            items: [{ type: "STANDARD" }]
        });
        (validateAddressWithQuotes as jest.Mock).mockResolvedValue({
            error: { error_code: "4009" }
        });

        const result = await checkAddress(mockProps);
        expect(result).toBe(false);
        expect(mockProps.setOutOfStockError).toHaveBeenCalled();
    });

    it("should return false and call setInvalidAddress when no items returned", async () => {
        (getShipMethods as jest.Mock).mockResolvedValue({
            items: [{ type: "STANDARD" }]
        });
        (validateAddressWithQuotes as jest.Mock).mockResolvedValue({
            items: []
        });

        const result = await checkAddress(mockProps);
        expect(result).toBe(false);
        expect(mockProps.setInvalidAddress).toHaveBeenCalled();
    });
});
