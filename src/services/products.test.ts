import { Product } from "types/Product";
import { getProductBySKU, taxology } from "./products";

describe("taxology", () => {
    it("calculates taxInclusive for taxInclusiveFrontEnd", () => {
        const result = taxology({
            marketExceptions: { taxInclusiveFrontEnd: true },
            priceLevel: {
                priceEach: 100,
                taxEach: { amount: 10 },
                taxInclusive: null
            }
        });
        expect(result.taxInclusive).toBe(110);
    });

    it("sets taxInclusive to priceEach for taxInclusiveBackEnd", () => {
        const result = taxology({
            marketExceptions: { taxInclusiveBackEnd: true },
            priceLevel: {
                priceEach: 100,
                taxEach: { amount: 10 },
                taxInclusive: null
            }
        });
        expect(result.taxInclusive).toBe(100);
    });

    it("sets taxInclusive to null when no exceptions", () => {
        const result = taxology({
            priceLevel: {
                priceEach: 100,
                taxEach: { amount: 10 },
                taxInclusive: null
            }
        });
        expect(result.taxInclusive).toBeNull();
    });
});

describe("getProductBySKU", () => {
    const mockProducts: Product[] = [
        { item: { id: { unicity: "SKU1" } } },
        { item: { id: { unicity: "SKU2" } } }
    ] as Product[];

    it("returns the correct product for a given SKU", () => {
        const result = getProductBySKU("SKU1", mockProducts);
        expect(result).toEqual(mockProducts[0]);
    });

    it("returns undefined for non-existent SKU", () => {
        const result = getProductBySKU("SKU3", mockProducts);
        expect(result).toBeUndefined();
    });
});
