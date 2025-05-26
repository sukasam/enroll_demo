import { deleteCookie, getCookie, setCookie } from "cookies-next";

export const AUTH_TOKEN_COOKIE = "_unicityToken_v5_enroll";

export function getAuthToken(): string {
    return (getCookie(AUTH_TOKEN_COOKIE) as string) || "";
}

export function setAuthToken(token: string): void {
    setCookie(AUTH_TOKEN_COOKIE, token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    });
}

export function clearAuthToken(): void {
    deleteCookie(AUTH_TOKEN_COOKIE, { path: "/" });
}

export function validateAuthToken(token: string): boolean {
    if (!token) return false;
    // Add any additional token validation logic here
    return true;
}
