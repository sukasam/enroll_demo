import { Alpha2, Alpha3 } from "Constants/countryConfig/enums";
import { toAlpha2 } from "Services/locale";
import { setCookie } from "cookies-next";
import { IncomingMessage, ServerResponse } from "http";
import { toUpper } from "lodash-es";
import { GetServerSidePropsContext } from "next";

interface UrlParams {
    countryCode?: string;
    language?: string;
    ref?: string;
}

interface CookieHandlerOptions {
    setCountry?: boolean;
    setLanguage?: boolean;
    setRef?: boolean;
}

type CookieContext =
    | GetServerSidePropsContext
    | { cookies: Record<string, string> };

interface CookieOptions {
    req?: IncomingMessage;
    res?: ServerResponse;
    path: string;
    sameSite: "none";
    secure: boolean;
}

/**
 * Creates cookie options based on the context
 */
function createCookieOptions(ctx: CookieContext): CookieOptions {
    return "req" in ctx
        ? {
              req: ctx.req,
              res: ctx.res,
              path: "/",
              sameSite: "none",
              secure: true
          }
        : {
              path: "/",
              sameSite: "none",
              secure: true
          };
}

/**
 * Sets country cookie with proper validation and conversion
 */
function setCountryCookie(
    countryCode: string | undefined,
    cookieOptions: CookieOptions
): void {
    if (!countryCode) return;

    const countryCodeUpper =
        toUpper(countryCode as Alpha3 | Alpha2) || Alpha2.US;
    const alpha2 =
        countryCodeUpper?.length === 3
            ? toAlpha2(countryCodeUpper as Alpha3)
            : countryCodeUpper;

    setCookie("country", alpha2, cookieOptions);
}

/**
 * Sets language cookie with proper formatting
 */
function setLanguageCookie(
    language: string | undefined,
    cookieOptions: CookieOptions
): void {
    if (!language) return;

    const cleanLanguage = language.split("_")[0];
    setCookie("language", cleanLanguage, cookieOptions);
}

/**
 * Sets referral cookies
 */
function setReferralCookies(
    ref: string | undefined,
    cookieOptions: CookieOptions
): void {
    if (!ref) return;

    setCookie("refId", ref, cookieOptions);
    setCookie("isReferred", "true", cookieOptions);
}

/**
 * Handles URL parameters and sets corresponding cookies
 */
export async function handleUrlParamsCookies(
    ctx: CookieContext,
    params: UrlParams,
    options: CookieHandlerOptions = {
        setCountry: true,
        setLanguage: true,
        setRef: true
    }
): Promise<void> {
    const { countryCode, language, ref } = params;
    const cookieOptions = createCookieOptions(ctx);

    if (options.setCountry) {
        setCountryCookie(countryCode, cookieOptions);
    }

    if (options.setLanguage) {
        setLanguageCookie(language, cookieOptions);
    }

    if (options.setRef) {
        setReferralCookies(ref, cookieOptions);
    }
}

export const defaultHomeRedirect = {
    redirect: {
        permanent: false,
        destination: "/home"
    }
};
