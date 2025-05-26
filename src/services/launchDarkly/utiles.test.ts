import { Alpha2 } from "Constants/countryConfig/enums"; // Ensure this import is correct
import { BasicBanner, EmptyBasicBanner } from "./types";
import isActiveBanner from "./utiles";

describe("isActiveBanner", () => {
    it("should return true for a valid BasicBanner", () => {
        const banner: BasicBanner = {
            markets: [Alpha2.US, Alpha2.CA],
            rosettaTag: "test_banner_tag"
        };
        expect(isActiveBanner(banner)).toBe(true);
    });

    it("should return false for null", () => {
        expect(isActiveBanner(null)).toBe(false);
    });

    it("should return false for undefined", () => {
        expect(isActiveBanner(undefined)).toBe(false);
    });

    it("should return false for an empty object", () => {
        const emptyBanner: EmptyBasicBanner = {};
        expect(isActiveBanner(emptyBanner)).toBe(false);
    });

    it("should return true for a BasicBanner with minimal properties", () => {
        const minimalBanner: BasicBanner = {
            markets: [],
            rosettaTag: ""
        };
        expect(isActiveBanner(minimalBanner)).toBe(true);
    });
});
