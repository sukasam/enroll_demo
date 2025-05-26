import * as countryConfig from "Constants/countryConfig";
import { Alpha2 } from "Constants/countryConfig/enums";
import countryRedirect from "./countryRedirect";

// Mock the external dependencies
jest.mock("Constants/countryConfig", () => ({
    getCountryConfig: jest.fn(),
    isSupported: jest.fn().mockReturnValue(false)
}));

jest.mock("Shared/httpTools", () => ({
    isProd: false
}));

describe("countryRedirect", () => {
    const origin = "https://example.com";
    const fallbackLanguage = "en";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should handle unsupported country with ushop-link redirect", () => {
        countryConfig.getCountryConfig.mockReturnValue({
            alpha2: "US",
            redirect: "https://ushop-link.com",
            languages: [{ default: true, code: "en" }]
        });
        countryConfig.isSupported.mockReturnValue(false);

        const result = countryRedirect(
            Alpha2.US,
            fallbackLanguage,
            origin,
            "referral123"
        );

        expect(result).toEqual({
            isInternal: false,
            path: "https://ushop-link.com/referral123"
        });
    });

    test("should handle unsupported country with non-ushop redirect", () => {
        countryConfig.getCountryConfig.mockReturnValue({
            alpha2: "CA",
            redirect: "https://other-redirect.com",
            languages: [{ default: true, code: "en" }]
        });
        countryConfig.isSupported.mockReturnValue(false);

        const result = countryRedirect(
            Alpha2.CA,
            fallbackLanguage,
            origin,
            "referral123"
        );

        expect(result).toEqual({
            isInternal: false,
            path: "https://other-redirect.com"
        });
    });

    test("should handle unsupported country without redirect", () => {
        countryConfig.getCountryConfig.mockReturnValue({
            alpha2: "MX",
            languages: [{ default: true, code: "es" }]
        });
        countryConfig.isSupported.mockReturnValue(false);

        const result = countryRedirect(
            Alpha2.MX,
            fallbackLanguage,
            origin,
            "referral123"
        );

        expect(result).toEqual({
            isInternal: false,
            path: "http://enroll.ng.unicityqa.com/master/#/enroll/start/MX/referral123/es_MX"
        });
    });

    test("should handle supported country", () => {
        countryConfig.getCountryConfig.mockReturnValue({
            alpha2: "GB",
            alpha3: "GBR",
            languages: [{ default: true, code: "en" }]
        });
        countryConfig.isSupported.mockReturnValue(true);

        const result = countryRedirect(
            Alpha2.GB,
            fallbackLanguage,
            origin,
            "referral123"
        );

        expect(result).toEqual({
            isInternal: true,
            path: null
        });
    });

    test("should handle country with no config", () => {
        countryConfig.getCountryConfig.mockReturnValue(null);

        const result = countryRedirect(
            Alpha2.XX,
            fallbackLanguage,
            origin,
            "referral123"
        );

        expect(result).toEqual({
            isInternal: true,
            path: "https://example.com/home/referral123"
        });
    });

    test("should use fallback language when no default language is found", () => {
        countryConfig.getCountryConfig.mockReturnValue({
            alpha2: "FR",
            languages: [{ code: "fr" }]
        });
        countryConfig.isSupported.mockReturnValue(false);

        const result = countryRedirect(
            Alpha2.FR,
            fallbackLanguage,
            origin,
            "referral123"
        );

        expect(result).toEqual({
            isInternal: false,
            path: "http://enroll.ng.unicityqa.com/master/#/enroll/start/FR/referral123/en_FR"
        });
    });
});
