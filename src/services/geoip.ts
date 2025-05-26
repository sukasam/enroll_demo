import { getDefaultLanguage } from "Constants/countryConfig";
import { Alpha2, Alpha3 } from "Constants/countryConfig/enums";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { NextIncomingMessage } from "next/dist/server/request-meta";
import { toAlpha3 } from "./locale";

const geoLookup = async (
    req: NextIncomingMessage & {
        cookies: NextApiRequestCookies;
    }
): Promise<{ alpha2: Alpha2; alpha3: Alpha3; language: string }> => {
    const alpha2CountryCode = req?.headers?.["cf-ipcountry"];
    const alpha3CountryCode = toAlpha3(alpha2CountryCode as Alpha2);

    console.log(req?.headers?.["cf-ipcountry"], "cloudflare country code");
    console.log(
        req.headers["accept-language"]?.split("-")[0],
        "accept language"
    );

    const countryCode = (alpha2CountryCode as Alpha2) || Alpha2.US;

    const browserLanguage =
        req.headers["accept-language"]?.split("-")[0] ?? "en";

    const defaultLanguage = getDefaultLanguage(countryCode);

    const language = browserLanguage || defaultLanguage;

    console.log(language, "use language on site");

    return {
        alpha2: countryCode,
        alpha3: alpha3CountryCode as Alpha3,
        language
    };
};

export default geoLookup;
