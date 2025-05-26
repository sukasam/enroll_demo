import { Alpha2, Alpha3 } from "Constants/countryConfig/enums";
import * as locale from "./locale";

jest.mock("Constants/countryConfig", () => ({
    countryConfigs: [
        { alpha2: "US", alpha3: "USA" },
        { alpha2: "GB", alpha3: "GBR" },
        { alpha2: "CA", alpha3: "CAN" }
    ]
}));

jest.mock("next/router", () => ({
    useRouter: (): { query: { alpha3: string } } => ({
        query: { alpha3: "USA" }
    })
}));

// Mock React and useMemo
jest.mock("react", (): { useMemo: (fn: () => any) => any } => ({
    ...jest.requireActual("react"),
    useMemo: (fn: () => any) => fn()
}));

describe("locale", () => {
    describe("toAlpha3", () => {
        it("converts Alpha2 to Alpha3", () => {
            expect(locale.toAlpha3(Alpha2.US)).toBe(Alpha3.USA);
            expect(locale.toAlpha3(Alpha2.GB)).toBe(Alpha3.GBR);
        });

        it("returns USA for unknown Alpha2", () => {
            expect(locale.toAlpha3("XX" as Alpha2)).toBe(Alpha3.USA);
        });
    });

    describe("toAlpha2", () => {
        it("converts Alpha3 to Alpha2", () => {
            expect(locale.toAlpha2(Alpha3.USA)).toBe(Alpha2.US);
            expect(locale.toAlpha2(Alpha3.GBR)).toBe(Alpha2.GB);
        });

        it("returns US for unknown Alpha3", () => {
            expect(locale.toAlpha2("XXX" as Alpha3)).toBe(Alpha2.US);
        });
    });

    describe("routerPropToAlpha2", () => {
        it("converts string Alpha3 to Alpha2", () => {
            expect(locale.routerPropToAlpha2("USA")).toBe(Alpha2.US);
        });

        it("converts array Alpha3 to Alpha2", () => {
            expect(locale.routerPropToAlpha2(["USA"])).toBe(Alpha2.US);
        });
    });

    describe("isSupportedRawAlpha3", () => {
        it("returns true for supported Alpha3", () => {
            expect(locale.isSupportedRawAlpha3("USA")).toBe(true);
        });

        it("returns false for unsupported Alpha3", () => {
            expect(locale.isSupportedRawAlpha3("XXX")).toBe(false);
        });
    });

    describe("formatLocale", () => {
        it("formats locale with Alpha2", () => {
            expect(
                locale.formatLocale({ language: "en", alpha2: Alpha2.US })
            ).toBe("en-US");
        });

        it("formats locale with Alpha3", () => {
            expect(
                locale.formatLocale({ language: "en", alpha3: Alpha3.USA })
            ).toBe("en-US");
        });

        it("throws error when neither Alpha2 nor Alpha3 is provided", () => {
            expect(() => locale.formatLocale({ language: "en" })).toThrow();
        });
    });

    describe("getShipToCountryWithExceptions", () => {
        it("returns US for PR", () => {
            expect(locale.getShipToCountryWithExceptions(Alpha2.PR)).toBe(
                Alpha2.US
            );
        });

        it("returns the same Alpha2 for non-PR countries", () => {
            expect(locale.getShipToCountryWithExceptions(Alpha2.CA)).toBe(
                Alpha2.CA
            );
        });
    });

    describe("useAlpha2", () => {
        it("returns Alpha2 from router query", () => {
            expect(locale.useAlpha2()).toBe(Alpha2.US);
        });
    });
});
