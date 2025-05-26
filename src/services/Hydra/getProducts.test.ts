import { getCountryConfig } from "Constants/countryConfig";
import { Alpha2 } from "Constants/countryConfig/enums";
import { taxology } from "Services/products";
import httpTools from "Shared/httpTools.js";
import { CustomerType } from "Types/enums";
import getProducts from "./getProducts";

jest.mock("Constants/countryConfig");
jest.mock("Services/products");
jest.mock("Shared/httpTools.js");

describe("getProducts", () => {
    const mockProps = {
        alpha2: Alpha2.US,
        language: "en",
        customerType: CustomerType.MEMBER
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (getCountryConfig as jest.Mock).mockReturnValue({
            marketExceptions: {}
        });
        (taxology as jest.Mock).mockImplementation(input => input.priceLevel);
    });

    it("calls sendRequest with correct parameters", async () => {
        const mockResponse = { catalogSlides: [] };
        (httpTools.sendRequest as jest.Mock).mockResolvedValue(mockResponse);

        await getProducts(mockProps);

        expect(httpTools.sendRequest).toHaveBeenCalledWith({
            method: "GET",
            url: "/api/catalog/shop?catalog=US%20Enrollment&market=US&language=en&customer=Member&priceLevels=Customer,Member,Associate",
            withAuth: false,
            baseURL: "jeeves",
            headers: {
                "Accept-Language": "en-US"
            }
        });
    });

    it("handles Puerto Rico correctly", async () => {
        await getProducts({ ...mockProps, alpha2: Alpha2.PR });

        expect(httpTools.sendRequest).toHaveBeenCalledWith(
            expect.objectContaining({
                url: expect.stringContaining(
                    "catalog=PR%20Enrollment&market=PR"
                ),
                headers: {
                    "Accept-Language": "en-PR"
                }
            })
        );
    });

    it("processes product price levels", async () => {
        const mockProduct = {
            priceLevels: {
                Member: { price: 100 },
                Customer: { price: 120 }
            }
        };
        const mockResponse = { catalogSlides: [mockProduct] };
        (httpTools.sendRequest as jest.Mock).mockResolvedValue(mockResponse);

        const result = await getProducts(mockProps);

        expect(taxology).toHaveBeenCalledTimes(2);
        expect(result).toEqual(mockResponse);
    });

    it("handles products without price levels", async () => {
        const mockProduct = { name: "Test Product" };
        const mockResponse = { catalogSlides: [mockProduct] };
        (httpTools.sendRequest as jest.Mock).mockResolvedValue(mockResponse);

        const result = await getProducts(mockProps);

        expect(result).toEqual(mockResponse);
    });
});
