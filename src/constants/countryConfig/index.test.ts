import * as translationContext from "Contexts/translation";
import * as React from "react";
import { Alpha2 } from "./enums";
import {
    countryConfigs,
    getCountries,
    getCountryConfig,
    getDefaultLanguage,
    getSuppotedCountries,
    getUnsupportedCountries,
    isSupported,
    useCountryConfig
} from "./index";

// Mock the countries data
jest.mock("./countries", () => [
    {
        alpha2: "US",
        isSupported: true,
        languages: [{ code: "en", default: true }]
    },
    {
        alpha2: "CA",
        isSupported: true,
        languages: [
            { code: "en", default: true },
            { code: "fr", default: false }
        ]
    },
    { alpha2: "MX", isSupported: false }
]);

// Mock the translation context
jest.mock("Contexts/translation", () => ({
    useTranslations: jest.fn()
}));

// Mock React's useMemo
jest.mock("react", () => ({
    ...jest.requireActual("react"),
    useMemo: jest.fn(fn => fn())
}));

describe("countryConfig", () => {
    describe("getSuppotedCountries", () => {
        it("returns only supported countries", () => {
            const supported = getSuppotedCountries();
            expect(supported.length).toBe(2);
            expect(supported.every(country => country.isSupported)).toBe(true);
        });
    });

    describe("getUnsupportedCountries", () => {
        it("returns only unsupported countries", () => {
            const unsupported = getUnsupportedCountries();
            expect(unsupported.length).toBe(1);
            expect(unsupported.every(country => !country.isSupported)).toBe(
                true
            );
        });
    });

    describe("getCountries", () => {
        it("returns supported countries when supported is true", () => {
            const countries = getCountries(true);
            expect(countries.length).toBe(2);
            expect(countries.every(country => country.isSupported)).toBe(true);
        });

        it("returns all countries when supported is false", () => {
            const countries = getCountries(false);
            expect(countries.length).toBe(3);
        });
    });

    describe("getCountryConfig", () => {
        it("returns supported country config when supportedOnly is true", () => {
            const config = getCountryConfig("US" as Alpha2, true);
            expect(config).toBeDefined();
            expect(config?.isSupported).toBe(true);
        });

        it("returns undefined for unsupported country when supportedOnly is true", () => {
            const config = getCountryConfig("MX" as Alpha2, true);
            expect(config).toBeUndefined();
        });

        it("returns country config regardless of support when supportedOnly is false", () => {
            const config = getCountryConfig("MX" as Alpha2, false);
            expect(config).toBeDefined();
            expect(config?.isSupported).toBe(false);
        });
    });

    describe("isSupported", () => {
        it("returns true for supported country config", () => {
            const config = countryConfigs.find(c => c.alpha2 === "US");
            expect(isSupported(config!)).toBe(true);
        });

        it("returns false for unsupported country config", () => {
            const config = countryConfigs.find(c => c.alpha2 === "MX");
            expect(isSupported(config!)).toBe(false);
        });
    });

    describe("useCountryConfig", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("returns country config for current country", () => {
            (translationContext.useTranslations as jest.Mock).mockReturnValue({
                country: "US"
            });
            const result = useCountryConfig();
            expect(result?.alpha2).toBe("US");
            expect(React.useMemo).toHaveBeenCalled();
        });

        it("returns undefined for unsupported country", () => {
            (translationContext.useTranslations as jest.Mock).mockReturnValue({
                country: "MX"
            });
            const result = useCountryConfig();
            expect(result).toBeUndefined();
            expect(React.useMemo).toHaveBeenCalled();
        });
    });

    describe("getDefaultLanguage", () => {
        it("returns default language code for supported country", () => {
            const language = getDefaultLanguage("US" as Alpha2);
            expect(language).toBe("en");
        });

        it('returns "en" for unsupported country', () => {
            const language = getDefaultLanguage("MX" as Alpha2);
            expect(language).toBe("en");
        });

        it("returns first default language when multiple languages are present", () => {
            const language = getDefaultLanguage("CA" as Alpha2);
            expect(language).toBe("en");
        });
    });
});
