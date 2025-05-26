import { getCookie } from "cookies-next";
import httpTools from "./httpTools";

// Mock fetch globally
global.fetch = jest.fn();
jest.mock("cookies-next");

describe("httpTools", () => {
    let originalNextPublicAppEnv;

    beforeEach(() => {
        originalNextPublicAppEnv = process.env.NEXT_PUBLIC_APP_ENV;
        jest.clearAllMocks();
    });

    afterEach(() => {
        process.env.NEXT_PUBLIC_APP_ENV = originalNextPublicAppEnv;
    });

    const setEnvironment = env => {
        process.env.NEXT_PUBLIC_APP_ENV = env;
    };

    test("createParamString creates correct query string", () => {
        const params = { foo: "bar", baz: "qux" };
        const result = httpTools.createParamString(params);
        expect(result).toBe("?foo=bar&baz=qux");
    });

    test("getCdnUrl returns correct CDN URL", () => {
        expect(httpTools.getCdnUrl()).toBe("https://cdn.unicity.com/config");
    });

    test("getJsonHeaders returns correct headers with auth", () => {
        const result = httpTools.getJsonHeaders({
            withAuth: true,
            token: "test-token"
        });
        expect(result).toEqual({
            "Content-Type": "application/json",
            "x-application": "enroll",
            Authorization: "Bearer test-token"
        });
    });

    test("sendRequest handles network errors", async () => {
        setEnvironment("development");

        global.fetch.mockRejectedValue(new Error("Network error"));

        await expect(
            httpTools.sendRequest({
                method: "GET",
                url: "/test"
            })
        ).rejects.toThrow("Network error");
    });

    test("createParamString handles empty params object", () => {
        const result = httpTools.createParamString({});
        expect(result).toBe("");
    });

    test("createParamString handles null and undefined values", () => {
        const params = { foo: "bar", baz: null, qux: undefined };
        const result = httpTools.createParamString(params);
        expect(result).toBe("?foo=bar");
    });

    test("getJsonHeaders returns automation-enroll when autobots cookie is set", () => {
        getCookie.mockImplementation(name => {
            if (name === "autobots") return "true";
            return null;
        });

        const result = httpTools.getJsonHeaders({ withAuth: false });

        expect(result).toEqual({
            "Content-Type": "application/json",
            "x-application": "enroll.automation"
        });
        expect(getCookie).toHaveBeenCalledWith("autobots");
    });
});
