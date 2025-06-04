import { AppContext } from "next/app";
import { ParsedUrlQuery } from "querystring";
import { KNOWN_ROUTES } from "../constants/routes";
import { clearAllAppData } from "./cookieUtils";

export function validateProtectedRoute(path: string): boolean {
    const protectedRoutes = ["/dashboard", "/profile", "/settings"];
    return protectedRoutes.some(route => path.startsWith(route));
}

export function validatePublicOnlyRoute(path: string): boolean {
    const publicOnlyRoutes = ["/login", "/register", "/reset"];
    return publicOnlyRoutes.some(route => path.startsWith(route));
}

export function validateThankYouPage(path: string): boolean {
    // Check if path starts with /thank-you (handles both page and .json)
    if (path.startsWith("/thank-you")) {
        return true;
    }
    return false;
}

export function validateThankYouAccess(query: ParsedUrlQuery): boolean {
    const hasOrderId = !!query.orderId;
    const noPurchase = query.noPurchase === "true";
    return hasOrderId || noPurchase;
}

export function getRedirectResult(query: ParsedUrlQuery): string | null {
    if (query.redirect) {
        return query.redirect as string;
    }
    return null;
}

interface RouteValidationResult {
    shouldRedirect: boolean;
    redirectPath?: string;
}

export async function handleRouteValidation(
    path: string,
    query: { [key: string]: string | string[] | undefined },
    hasUserToken: boolean,
    appContext: AppContext
): Promise<RouteValidationResult> {
    if (path === "/reset") {
        await handleResetRoute(appContext);
        return { shouldRedirect: true, redirectPath: "/home" };
    }

    if (validateProtectedRoute(path) && !hasUserToken) {
        return { shouldRedirect: true, redirectPath: "/login" };
    }

    if (validatePublicOnlyRoute(path) && hasUserToken) {
        return { shouldRedirect: true, redirectPath: "/home" };
    }

    if (validateThankYouPage(path)) {
        const thankYouResult = await handleThankYouRoute(query);
        if (thankYouResult.shouldRedirect) {
            return thankYouResult;
        }
    }

    const isKnownRoute = KNOWN_ROUTES.some(route => path?.includes(route));
    if (!isKnownRoute) {
        return { shouldRedirect: true, redirectPath: "/home" };
    }

    return { shouldRedirect: false };
}

async function handleResetRoute(appContext: AppContext): Promise<void> {
    clearAllAppData(appContext.ctx);
    if (typeof window !== "undefined") {
        localStorage.clear();
        const translationContext = sessionStorage.getItem("translationContext");
        sessionStorage.clear();
        if (translationContext) {
            sessionStorage.setItem("translationContext", translationContext);
        }
    }
}

async function handleThankYouRoute(query: {
    [key: string]: string | string[] | undefined;
}): Promise<RouteValidationResult> {
    if (!validateThankYouAccess(query)) {
        return { shouldRedirect: true, redirectPath: "/home" };
    }

    const redirectResult = getRedirectResult(query);
    if (redirectResult) {
        return { shouldRedirect: true, redirectPath: redirectResult };
    }

    return { shouldRedirect: false };
}
