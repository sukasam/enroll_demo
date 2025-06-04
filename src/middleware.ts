import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest): NextResponse {
    // Get the pathname of the request
    const path = request.nextUrl.pathname;

    // If the path is exactly "/", redirect to "/home"
    if (path === "/") {
        return NextResponse.redirect(new URL("/home", request.url));
    }

    return NextResponse.next();
}

// Configure the middleware to run only on the root path
export const config = {
    matcher: "/"
};
