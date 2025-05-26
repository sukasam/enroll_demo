import httpTools from "Shared/httpTools";
import validateAddressWithQuotes from "./quotesAddressValidation";

jest.mock("Shared/httpTools");

describe("validateAddressWithQuotes", () => {
    const mockInput = {
        sku: "12345",
        shippingMethod: "standard",
        city: "New York",
        country: "US",
        state: "NY",
        address1: "123 Main St",
        address2: "Apt 4B",
        zip: "10001"
    };

    beforeEach(() => {
        jest.clearAllMocks();
        httpTools.envUrl.mockReturnValue("https://api.example.com");
        httpTools.sendRequest.mockResolvedValue({ success: true });
    });

    it("sends correct request for US address", async () => {
        await validateAddressWithQuotes(mockInput);

        expect(httpTools.sendRequest).toHaveBeenCalledWith(
            expect.objectContaining({
                method: "POST",
                url: "/quotes",
                withAuth: false,
                data: expect.objectContaining({
                    order: expect.objectContaining({
                        shipToAddress: expect.objectContaining({
                            country: "US",
                            city: "New York",
                            state: "NY"
                        }),
                        market: "US"
                    })
                })
            })
        );
    });

    it("adjusts country for Puerto Rico", async () => {
        const prInput = { ...mockInput, country: "PR" };
        await validateAddressWithQuotes(prInput);

        expect(httpTools.sendRequest).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    order: expect.objectContaining({
                        shipToAddress: expect.objectContaining({
                            country: "US"
                        }),
                        market: "US"
                    })
                })
            })
        );
    });

    it("returns the response from httpTools.sendRequest", async () => {
        const result = await validateAddressWithQuotes(mockInput);
        expect(result).toEqual({ success: true });
    });
});
