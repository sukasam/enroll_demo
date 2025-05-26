import { renderHook, waitFor } from "@testing-library/react";
import { useProducts } from "Contexts/ProductContext";
import { useTranslations } from "Contexts/translation";
import getProducts from "Hydra/getProducts";
import useLoadProducts from "./hooks";

// Mock the dependencies
jest.mock("Contexts/ProductContext");
jest.mock("Contexts/translation");
jest.mock("Hydra/getProducts");

describe("useLoadProducts", () => {
    const mockSetProducts = jest.fn();
    const mockCatalogSlides = [
        { id: 1, name: "Product 1" },
        { id: 2, name: "Product 2" }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        useProducts.mockReturnValue({
            setProducts: mockSetProducts
        });
        getProducts.mockResolvedValue({
            catalogSlides: mockCatalogSlides
        });
    });

    it("should call getProducts with correct parameters", async () => {
        renderHook(() => useLoadProducts());
        expect(getProducts).toHaveBeenCalledWith({
            alpha2: "US",
            customerType: "Member",
            language: "en"
        });
    });

    it("should set products with catalog slides", async () => {
        renderHook(() => useLoadProducts());

        await waitFor(() => {
            expect(mockSetProducts).toHaveBeenCalledWith(mockCatalogSlides);
        });
    });

    it("should reload products when language or country changes", async () => {
        const { rerender } = renderHook(() => useLoadProducts());

        await waitFor(() => {
            expect(getProducts).toHaveBeenCalledTimes(1);
        });

        useTranslations.mockReturnValue({ country: "CA", language: "fr" });
        rerender();

        await waitFor(() => {
            expect(getProducts).toHaveBeenCalledTimes(2);
            expect(getProducts).toHaveBeenLastCalledWith({
                alpha2: "CA",
                customerType: "Member",
                language: "fr"
            });
        });
    });
});
