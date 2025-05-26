import { datadogRum } from "@datadog/browser-rum";
import * as cookiesNext from "cookies-next";
import mixpanelService from "./initializeMixPanel";
import MixpanelEvent from "./mixpanelEvent";

jest.mock("@datadog/browser-rum");
jest.mock("uuid", () => ({
    v4: (): string => "mock-uuid"
}));

describe("MixpanelService", () => {
    let mockFetch: jest.Mock;
    let getCookieSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock environment variables
        process.env.NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN = "test-token";

        // Mock window.screen dimensions
        Object.defineProperty(window, "screen", {
            value: {
                width: 1920,
                height: 1080
            },
            writable: true,
            configurable: true
        });

        // Mock window.location
        Object.defineProperty(window, "location", {
            value: {
                href: "https://test.com/page",
                search: ""
            },
            writable: true,
            configurable: true
        });

        // Mock cookies
        getCookieSpy = jest
            .spyOn(cookiesNext, "getCookie")
            .mockImplementation((key: string) => {
                switch (key) {
                    case "refId":
                        return "test-ref-id";
                    case "country":
                        return "US";
                    case "language":
                        return "en";
                    case "device_id":
                        return "mock-uuid";
                    case "cookieyes-consent":
                        return "analytics:yes";
                    default:
                        return undefined;
                }
            });

        // Set up mocks with proper typing
        mockFetch = jest.fn().mockResolvedValue({ ok: true });
        global.fetch = mockFetch as jest.Mock;

        // Mock window properties
        Object.defineProperty(window, "innerWidth", { value: 1920 });
        Object.defineProperty(window, "innerHeight", { value: 1080 });
        Object.defineProperty(window, "location", {
            value: {
                href: "https://test.com/page",
                pathname: "/page",
                search: "",
                hostname: "test.com"
            }
        });

        // Mock datadogRum
        (datadogRum.getInternalContext as jest.Mock).mockReturnValue({
            session_id: "test-session"
        });

        // Reset and initialize the service with consent
        (mixpanelService as any).hasValidToken = true;
        (mixpanelService as any).isInitialized = true;
        jest.spyOn(mixpanelService as any, "hasConsent").mockReturnValue(true);
        mixpanelService.initializeSuperProperties();
    });

    afterEach(() => {
        getCookieSpy.mockRestore();
        delete process.env.NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN;
    });

    describe("initialization", () => {
        it("should initialize with default super properties", async () => {
            await mixpanelService.trackEvent(MixpanelEvent.TEST_EVENT);

            expect(mockFetch).toHaveBeenCalledWith(
                "/api/mixpanel",
                expect.objectContaining({
                    method: "POST",
                    body: expect.stringContaining(
                        'unicity_product":"enrollment"'
                    )
                })
            );
        });

        it("should include refId in super properties when present", async () => {
            await mixpanelService.trackEvent(MixpanelEvent.TEST_EVENT);

            // Verify that fetch was called
            expect(mockFetch).toHaveBeenCalled();

            const call = mockFetch.mock.calls[0][1];
            expect(call).toBeDefined();
            expect(call.body).toBeDefined();

            const body = JSON.parse(call.body);
            expect(body).toBeDefined();
            expect(body.properties).toBeDefined();
            expect(body.properties).toHaveProperty(
                "enroller_referral_code",
                "test-ref-id"
            );
        });

        it("should not include refId in super properties when absent", async () => {
            getCookieSpy.mockImplementation((key: string) => {
                switch (key) {
                    case "country":
                        return "US";
                    case "language":
                        return "en";
                    case "device_id":
                        return "mock-uuid";
                    default:
                        return undefined;
                }
            });

            mixpanelService.reset();
            mixpanelService.initialize();
            await mixpanelService.trackEvent(MixpanelEvent.TEST_EVENT);

            expect(mockFetch).toHaveBeenCalledWith(
                "/api/mixpanel",
                expect.objectContaining({
                    body: expect.not.stringContaining("enroller_referral_code")
                })
            );
        });
    });

    describe("trackPageView", () => {
        it("should track page view with correct properties", async () => {
            await mixpanelService.trackPageView("test-page");

            const call = mockFetch.mock.calls[0][1];
            const body = JSON.parse(call.body);

            expect(body.properties).toEqual(
                expect.objectContaining({
                    page: "test-page",
                    unicity_product: "enrollment"
                })
            );
        });
    });

    describe("trackEvent", () => {
        it("should send event with correct properties", async () => {
            await mixpanelService.trackEvent(MixpanelEvent.TEST_EVENT);

            expect(mockFetch).toHaveBeenCalledWith(
                "/api/mixpanel",
                expect.objectContaining({
                    method: "POST",
                    body: expect.stringContaining("test_event")
                })
            );
        });

        it("should include device ID in tracked events", async () => {
            await mixpanelService.trackEvent(MixpanelEvent.TEST_EVENT);

            expect(mockFetch).toHaveBeenCalledWith(
                "/api/mixpanel",
                expect.objectContaining({
                    body: expect.stringContaining("mock-uuid")
                })
            );
        });
    });

    describe("error handling", () => {
        it("should handle API errors gracefully", async () => {
            mockFetch.mockRejectedValue(new Error("API Error"));
            const consoleSpy = jest.spyOn(console, "error");

            await mixpanelService.trackEvent(MixpanelEvent.TEST_EVENT);

            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });

        it("should handle non-OK responses", async () => {
            mockFetch.mockResolvedValue({ ok: false });
            const consoleSpy = jest.spyOn(console, "error");

            await mixpanelService.trackEvent(MixpanelEvent.TEST_EVENT);

            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe("browser metadata", () => {
        it("should include browser metadata in events", async () => {
            await mixpanelService.trackEvent(MixpanelEvent.TEST_EVENT);

            expect(mockFetch).toHaveBeenCalledWith(
                "/api/mixpanel",
                expect.objectContaining({
                    body: expect.stringContaining("1920")
                })
            );
        });
    });

    describe("Datadog integration", () => {
        it("should include Datadog session URL when available", async () => {
            await mixpanelService.trackEvent(MixpanelEvent.TEST_EVENT);

            expect(mockFetch).toHaveBeenCalledWith(
                "/api/mixpanel",
                expect.objectContaining({
                    body: expect.stringContaining("test-session")
                })
            );
        });
    });

    describe("referrer handling", () => {
        beforeEach(() => {
            // Mock document.referrer using Object.defineProperty
            Object.defineProperty(document, "referrer", {
                get: () => "",
                configurable: true
            });
        });

        afterEach(() => {
            // Restore original referrer
            Object.defineProperty(document, "referrer", {
                get: () => "",
                configurable: true
            });
        });

        it("should omit referrer data when document.referrer is empty", async () => {
            await mixpanelService.trackEvent(MixpanelEvent.TEST_EVENT);
            expect(mockFetch).toHaveBeenCalledWith(
                "/api/mixpanel",
                expect.objectContaining({
                    body: expect.stringContaining("$direct")
                })
            );
        });

        it("should include referrer data when document.referrer exists", async () => {
            Object.defineProperty(document, "referrer", {
                get: () => "https://example.com",
                configurable: true
            });
            await mixpanelService.trackEvent(MixpanelEvent.TEST_EVENT);
            expect(mockFetch).toHaveBeenCalledWith(
                "/api/mixpanel",
                expect.objectContaining({
                    body: expect.stringContaining("example.com")
                })
            );
        });

        it("should handle invalid referrer URLs", async () => {
            Object.defineProperty(document, "referrer", {
                get: () => "invalid-url",
                configurable: true
            });
            await mixpanelService.trackEvent(MixpanelEvent.TEST_EVENT);
            expect(mockFetch).toHaveBeenCalledWith(
                "/api/mixpanel",
                expect.objectContaining({
                    body: expect.stringContaining("$direct")
                })
            );
        });

        it("should include internal navigation referrer", async () => {
            Object.defineProperty(document, "referrer", {
                get: () => "https://test.com/previous-page",
                configurable: true
            });
            await mixpanelService.trackEvent(MixpanelEvent.TEST_EVENT);
            expect(mockFetch).toHaveBeenCalledWith(
                "/api/mixpanel",
                expect.objectContaining({
                    body: expect.stringContaining("test.com/previous-page")
                })
            );
        });
    });
});
