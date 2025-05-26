import { deleteCookie, setCookie } from "cookies-next";
import { AppContext } from "next/app";

export function handleQueryParams(
    query: Record<string, unknown>,
    ctx: AppContext["ctx"]
): void {
    const queryFlags = {
        allowGuide: { cookie: "allowGuide" },
        autobots: { cookie: "autobots" },
        vv: { cookie: "enrollVerbosLogger" }
    };

    Object.entries(queryFlags).forEach(([flag, { cookie }]) => {
        if (query[flag] === "false") {
            deleteCookie(cookie, ctx);
        } else if (query[flag]) {
            setCookie(cookie, true, ctx);
        }
    });
}

export function clearAllAppData(ctx: AppContext["ctx"]): void {
    const cookiesToClear = [
        "_unicityToken_v5_enroll",
        "refId",
        "language",
        "allowGuide",
        "autobots",
        "enrollVerbosLogger"
    ];

    cookiesToClear.forEach(cookieName => {
        deleteCookie(cookieName, ctx);
    });
}
