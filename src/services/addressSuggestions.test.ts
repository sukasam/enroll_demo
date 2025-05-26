import { Alpha2 } from "Constants/countryConfig/enums";
import getAddressSuggestions, { getAddressById } from "./addressSuggestions";

global.fetch = jest.fn();

process.env.NEXT_PUBLIC_SMARTY_API_KEY = "test-api-key";

describe("addressSuggestions", () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear();
    });

    describe("getAddressSuggestions", () => {
        it("should return an empty array for empty query", async () => {
            const result = await getAddressSuggestions("", Alpha2.US);
            expect(result).toEqual([]);
        });

        it("should call US API for US addresses", async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                json: () => Promise.resolve({ candidates: [] })
            });

            await getAddressSuggestions("123 Main St", Alpha2.US);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining(
                    "https://us-autocomplete-pro.api.smartystreets.com/lookup"
                )
            );
        });

        it("should call International API for non-US addresses", async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                json: () => Promise.resolve({ candidates: [] })
            });

            await getAddressSuggestions("123 Main St", Alpha2.GB);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining(
                    "https://international-autocomplete.api.smartystreets.com/v2/lookup"
                )
            );
        });

        it("should parse US address suggestions correctly", async () => {
            const mockResponse = {
                candidates: [
                    {
                        street_line: "123 Main St",
                        secondary: "Apt 4",
                        city: "Anytown",
                        state: "NY",
                        zipcode: "12345"
                    }
                ]
            };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                json: () => Promise.resolve(mockResponse)
            });

            const result = await getAddressSuggestions("123 Main", Alpha2.US);

            expect(result).toEqual([
                {
                    address1: "123 Main St",
                    address2: "Apt 4",
                    city: "Anytown",
                    state: "NY",
                    zip: "12345",
                    country: "USA"
                }
            ]);
        });

        it("should parse international address suggestions correctly", async () => {
            const mockResponse = {
                candidates: [
                    {
                        address_text: "123 High Street",
                        address_id: "GBR|123",
                        zipcode: "SW1A 1AA",
                        entries: 1
                    }
                ]
            };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                json: () => Promise.resolve(mockResponse)
            });

            const result = await getAddressSuggestions("123 High", Alpha2.GB);

            expect(result).toEqual([
                {
                    address1: "123 High Street",
                    address2: "",
                    city: "",
                    state: "",
                    zip: "SW1A 1AA",
                    country: "",
                    addressId: "GBR|123",
                    entries: 1
                }
            ]);
        });

        it("should handle empty candidates array for US addresses", async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                json: () => Promise.resolve({ candidates: [] })
            });

            const result = await getAddressSuggestions(
                "123 Main St",
                Alpha2.US
            );
            expect(result).toEqual([]);
        });

        it("should handle empty candidates array for international addresses", async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                json: () => Promise.resolve({ candidates: [] })
            });

            const result = await getAddressSuggestions(
                "123 High Street",
                Alpha2.GB
            );
            expect(result).toEqual([]);
        });

        it("should handle missing secondary field in US address suggestions", async () => {
            const mockResponse = {
                candidates: [
                    {
                        street_line: "123 Main St",
                        city: "Anytown",
                        state: "NY",
                        zipcode: "12345"
                    }
                ]
            };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                json: () => Promise.resolve(mockResponse)
            });

            const result = await getAddressSuggestions("123 Main", Alpha2.US);

            expect(result).toEqual([
                {
                    address1: "123 Main St",
                    address2: "",
                    city: "Anytown",
                    state: "NY",
                    zip: "12345",
                    country: "USA"
                }
            ]);
        });

        it("should handle missing fields in international address suggestions", async () => {
            const mockResponse = {
                candidates: [
                    {
                        address_text: "123 High Street",
                        address_id: "GBR|123"
                    }
                ]
            };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                json: () => Promise.resolve(mockResponse)
            });

            const result = await getAddressSuggestions("123 High", Alpha2.GB);

            expect(result).toEqual([
                {
                    address1: "123 High Street",
                    address2: "",
                    city: "",
                    state: "",
                    zip: "",
                    country: "",
                    addressId: "GBR|123",
                    entries: undefined
                }
            ]);
        });
    });

    describe("getAddressById", () => {
        it("should return null if no candidates are found", async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                json: () => Promise.resolve({ candidates: [] })
            });

            const result = await getAddressById("test-id", Alpha2.GB);

            expect(result).toBeNull();
        });

        it("should parse address with address_text correctly", async () => {
            const mockResponse = {
                candidates: [
                    {
                        address_text: "123 High Street",
                        address_id: "GBR|123",
                        entries: 1
                    }
                ]
            };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                json: () => Promise.resolve(mockResponse)
            });

            const result = await getAddressById("GBR|123", Alpha2.GB);

            expect(result).toEqual([
                {
                    address1: "123 High Street",
                    address2: "",
                    city: "",
                    state: "",
                    zip: "",
                    country: "",
                    addressId: "GBR|123",
                    entries: 1
                }
            ]);
        });

        it("should parse address without address_text correctly", async () => {
            const mockResponse = {
                candidates: [
                    {
                        street: "123 Main St",
                        secondary: "Apt 4",
                        locality: "Anytown",
                        administrative_area: "NY",
                        postal_code: "12345",
                        country_iso3: "USA"
                    }
                ]
            };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                json: () => Promise.resolve(mockResponse)
            });

            const result = await getAddressById("USA|123", Alpha2.US);

            expect(result).toEqual([
                {
                    address1: "123 Main St",
                    address2: "Apt 4",
                    city: "Anytown",
                    state: "NY",
                    zip: "12345",
                    country: "USA"
                }
            ]);
        });

        it("should handle missing fields in address with address_text", async () => {
            const mockResponse = {
                candidates: [
                    {
                        address_text: "123 High Street"
                    }
                ]
            };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                json: () => Promise.resolve(mockResponse)
            });

            const result = await getAddressById("GBR|123", Alpha2.GB);

            expect(result).toEqual([
                {
                    address1: "123 High Street",
                    address2: "",
                    city: "",
                    state: "",
                    zip: "",
                    country: "",
                    addressId: undefined,
                    entries: undefined
                }
            ]);
        });

        it("should handle missing fields in address without address_text", async () => {
            const mockResponse = {
                candidates: [
                    {
                        street: "123 Main St",
                        locality: "Anytown"
                    }
                ]
            };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                json: () => Promise.resolve(mockResponse)
            });

            const result = await getAddressById("USA|123", Alpha2.US);

            expect(result).toEqual([
                {
                    address1: "123 Main St",
                    address2: "",
                    city: "Anytown",
                    state: "",
                    zip: "",
                    country: ""
                }
            ]);
        });
    });
});
