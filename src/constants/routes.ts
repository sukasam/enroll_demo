export const KNOWN_ROUTES = [
    "/logout",
    "/reset",
    "/login",
    "/register",
    "/c/",
    "/home",
    "/redirect",
    "/thank-you",
    "/[countryCode]/[language]/home",
    "/[countryCode]/[language]/home/[ref]"
] as const;

export type Route = (typeof KNOWN_ROUTES)[number];

export const PROTECTED_ROUTES: Route[] = ["/thank-you"];
export const PUBLIC_ONLY_ROUTES: Route[] = ["/home", "/login"];
