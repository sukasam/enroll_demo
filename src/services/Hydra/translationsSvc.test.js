import httpTools from "Shared/httpTools";
import { translationsSvc } from "./translationsSvc";

jest.mock("Shared/httpTools");

describe("translationsSvc", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("get", () => {
        it("should call sendRequest with correct parameters", () => {
            translationsSvc.get({ country: "CA", language: "fr" });
            expect(httpTools.sendRequest).toHaveBeenCalledWith({
                url: "/api/translations?country=CA&language=fr",
                withAuth: false,
                baseURL: "internal",
                headers: { "Accept-Language": "fr-CA" }
            });
        });

        it("should use default values if not provided", () => {
            translationsSvc.get({});
            expect(httpTools.sendRequest).toHaveBeenCalledWith({
                url: "/api/translations?country=US&language=en",
                withAuth: false,
                baseURL: "internal",
                headers: { "Accept-Language": "en-US" }
            });
        });
    });

    describe("getDirect", () => {
        it("should use production URL when NEXT_PUBLIC_APP_ENV is production", () => {
            process.env.NEXT_PUBLIC_APP_ENV = "production";
            translationsSvc.getDirect({ country: "CA", language: "fr" });
            expect(httpTools.sendRequest).toHaveBeenCalledWith({
                url: "https://cdn.unicity.com/translations/enroll/fr-CA.json",
                withAuth: false,
                baseURL: "internal",
                headers: { "Accept-Language": "fr-CA" }
            });
        });

        it("should use QA URL when NEXT_PUBLIC_APP_ENV is not production", () => {
            process.env.NEXT_PUBLIC_APP_ENV = "development";
            translationsSvc.getDirect({ country: "US", language: "en" });
            expect(httpTools.sendRequest).toHaveBeenCalledWith({
                url: "https://cdn.unicity.com/translations/qa/enroll/en-US.json",
                withAuth: false,
                baseURL: "internal",
                headers: { "Accept-Language": "en-US" }
            });
        });
    });
});
