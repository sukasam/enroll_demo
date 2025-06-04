import { Alpha2, Alpha3 } from "Constants/countryConfig/enums";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { NextIncomingMessage } from "next/dist/server/request-meta";
import geoLookup from "./geoip";

jest.mock("./locale", () => {
    const { Alpha2, Alpha3 } = jest.requireActual(
        "Constants/countryConfig/enums"
    );
    return {
        toAlpha3: jest.fn((alpha2: typeof Alpha2) => {
            const mockAlpha3Map: { [key in typeof Alpha2]?: typeof Alpha3 } = {
                [Alpha2.US]: Alpha3.USA,
                [Alpha2.GB]: Alpha3.GBR,
                [Alpha2.CA]: Alpha3.CAN
            };
            return mockAlpha3Map[alpha2] || Alpha3.USA;
        })
    };
});

describe("geoLookup", () => {
    const mockRequest = (
        headers: Record<string, string | undefined>
    ): NextIncomingMessage & { cookies: NextApiRequestCookies } =>
        ({
            headers,
            cookies: {}
        }) as NextIncomingMessage & { cookies: NextApiRequestCookies };

    beforeEach(() => {
        jest.clearAllMocks();
        console.log = jest.fn(); // Mock console.log to prevent output during tests
    });

    it("should return US as default when cf-ipcountry is undefined", async () => {
        const req = mockRequest({});
        const result = await geoLookup(req);
        expect(result).toEqual({
            alpha2: Alpha2.US,
            alpha3: Alpha3.USA,
            language: "en"
        });
    });

    it("should return correct country codes and language for US", async () => {
        const req = mockRequest({
            "cf-ipcountry": Alpha2.US,
            "accept-language": "en-US"
        });
        const result = await geoLookup(req);
        expect(result).toEqual({
            alpha2: Alpha2.US,
            alpha3: Alpha3.USA,
            language: "en"
        });
    });

    it("should return correct country codes and language for GB", async () => {
        const req = mockRequest({
            "cf-ipcountry": Alpha2.GB,
            "accept-language": "en-GB"
        });
        const result = await geoLookup(req);
        expect(result).toEqual({
            alpha2: Alpha2.GB,
            alpha3: Alpha3.GBR,
            language: "en"
        });
    });

    it("should handle different language", async () => {
        const req = mockRequest({
            "cf-ipcountry": Alpha2.CA,
            "accept-language": "fr-CA"
        });
        const result = await geoLookup(req);
        expect(result).toEqual({
            alpha2: Alpha2.CA,
            alpha3: Alpha3.CAN,
            language: "fr"
        });
    });

    it("should default to 'en' language if accept-language is not provided", async () => {
        const req = mockRequest({
            "cf-ipcountry": Alpha2.US
        });
        const result = await geoLookup(req);
        expect(result).toEqual({
            alpha2: Alpha2.US,
            alpha3: Alpha3.USA,
            language: "en"
        });
    });

    it("should log country code and language", async () => {
        const req = mockRequest({
            "cf-ipcountry": Alpha2.US,
            "accept-language": "en-US"
        });
        await geoLookup(req);
        expect(console.log).toHaveBeenCalledWith(
            Alpha2.US,
            "cloudflare country code"
        );
        expect(console.log).toHaveBeenCalledWith("en", "accept language");
    });
});
