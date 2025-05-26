import { ParsedUrlQuery } from "querystring";

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
