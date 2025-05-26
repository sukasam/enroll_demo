import {
    CompleteDigitalPack,
    CompletePack,
    CompleteProductConfig,
    Variant
} from "Constants/countryConfig/types";
import getVariantBySku from "./getVariantBySku";

describe("getVariantBySku", () => {
    const mockVariant1: Variant = {
        sku: "SKU1",
        price: 10,
        name: "",
        description: "",
        productImage: "",
        partsCount: "0",
        tabImage: "",
        options: {},
        rrp: 0
    };
    const mockVariant2: Variant = { ...mockVariant1, sku: "SKU2", price: 20 };
    const mockVariant3: Variant = { ...mockVariant1, sku: "SKU3", price: 30 };

    const mockPack1: CompletePack = {
        isDigital: false,
        variants: [mockVariant1, mockVariant2],
        mainFeatures: [],
        accentColor: "",
        buttonName: "",
        kitDescription: "",
        showPaymentType: false,
        backgroundColor: "",
        perks: [],
        extras: [],
        annotations: ""
    };

    const mockPack2: CompleteDigitalPack = {
        isDigital: true,
        variants: [
            {
                sku: "DIGITAL_SKU",
                price: 15,
                name: "Digital Product",
                description: "Digital product description",
                productImage: "",
                partsCount: "0",
                tabImage: "",
                options: {},
                rrp: 0
            }
        ],
        name: "Digital Pack",
        buttonName: "Buy Digital",
        description: "Digital pack description",
        showPaymentType: false
    };

    const mockPack3: CompletePack = {
        ...mockPack1,
        variants: [mockVariant3]
    };

    const mockProductConfig: CompleteProductConfig = {
        packs: [mockPack1, mockPack2, mockPack3],
        recommendedPack: 0
    };

    it("should return null when productConfig is null", () => {
        expect(getVariantBySku(null, "SKU1")).toBeNull();
    });

    it("should return the correct variant when SKU matches", () => {
        expect(getVariantBySku(mockProductConfig, "SKU2")).toEqual(
            mockVariant2
        );
    });

    it("should return null when SKU does not match and no default index is provided", () => {
        expect(getVariantBySku(mockProductConfig, "NONEXISTENT")).toBeNull();
    });

    it("should return the variant at the default index when SKU does not match", () => {
        expect(getVariantBySku(mockProductConfig, "NONEXISTENT", 1)).toEqual(
            mockVariant2
        );
    });

    it("should return null when default index is out of bounds", () => {
        expect(getVariantBySku(mockProductConfig, "NONEXISTENT", 5)).toBeNull();
    });

    it("should ignore digital products", () => {
        const digitalOnlyConfig: CompleteProductConfig = {
            packs: [mockPack2],
            recommendedPack: 0
        };
        expect(getVariantBySku(digitalOnlyConfig, "DIGITAL_SKU")).toBeNull();
    });

    it("should handle undefined SKU", () => {
        expect(getVariantBySku(mockProductConfig, undefined, 0)).toEqual(
            mockVariant1
        );
    });

    it("should handle null SKU", () => {
        expect(getVariantBySku(mockProductConfig, null, 0)).toEqual(
            mockVariant1
        );
    });
});
