/* eslint-disable class-methods-use-this */
import { datadogRum } from "@datadog/browser-rum";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import router from "next/router";
import { v4 as uuidv4 } from "uuid";
import MixpanelEvent from "./mixpanelEvent";

interface ReferrerData {
    $referrer: string;
    // eslint-disable-next-line camelcase
    $referring_domain: string;
}

interface CookieConsentData {
    analytics?: string;
    action?: string;
    functional?: string;
    necessary?: string;
    performance?: string;
}

class MixpanelService {
    private static instance: MixpanelService;

    private static readonly UTM_KEYS = [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "utm_term",
        "utm_id",
        "utm_source_platform",
        "utm_campaign_id",
        "utm_creative_format",
        "utm_marketing_tactic"
    ] as const;

    private previousPath = "";

    private superProperties: Record<string, string> = {};

    private deviceId: string;

    private userId: string | null = null;

    private isInitialized = false;

    private hasValidToken = false;

    private consentData: CookieConsentData | null = null;

    private constructor() {
        this.deviceId = this.initializeDeviceId();
        this.hasValidToken = !!process.env.NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN;
        if (!this.hasValidToken) {
            console.warn(
                "Mixpanel token is not set. Mixpanel tracking will be disabled."
            );
            return;
        }
        this.initialize();
    }

    public static getInstance(): MixpanelService {
        if (!MixpanelService.instance) {
            MixpanelService.instance = new MixpanelService();
        }
        return MixpanelService.instance;
    }

    private initializeDeviceId(): string {
        const storedDeviceId = getCookie("device_id") as string | undefined;
        if (storedDeviceId) {
            return storedDeviceId;
        }
        const newDeviceId = uuidv4();
        setCookie("device_id", newDeviceId, {
            maxAge: 60 * 60 * 24 * 365,
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        });
        return newDeviceId;
    }

    public initialize(): void {
        if (!this.hasValidToken || !this.hasConsent()) {
            return;
        }

        if (typeof window !== "undefined") {
            this.isInitialized = true;
            this.initializeSuperProperties();

            if (router?.events) {
                router.events.on("routeChangeStart", () => {
                    if (this.isInitialized) {
                        this.previousPath = window.location.href;
                    }
                });
            }

            // this.trackPageView(window.location.pathname);
        }
    }

    public hasConsent(): boolean {
        const cookieYes = getCookie("cookieyes-consent");
        const isCookieEnabled = getCookie("isCookieEnabled") === "true";

        if (cookieYes === undefined || cookieYes === null) {
            return true;
        }

        if (isCookieEnabled === false) {
            return true;
        }

        try {
            const jsonString = `{${cookieYes
                .split(",")
                .map(part => {
                    const [key, value] = part.split(":");
                    return `"${key.trim()}":"${value.trim()}"`;
                })
                .join(",")}}`;

            this.consentData = JSON.parse(jsonString);
            if (this.consentData?.action !== "yes") {
                return false;
            }
            const hasConsent = this.consentData?.analytics === "yes";
            const shouldInitialize = !isCookieEnabled || hasConsent;
            return shouldInitialize;
        } catch (error) {
            console.error("Failed to parse cookie consent data:", error);
            return true;
        }
    }

    public trackPageView(page: string): void {
        if (!this.hasValidToken || !this.hasConsent()) return;

        if (!("unicity_product" in this.superProperties)) {
            this.initializeSuperProperties();
        }

        if (this.isInitialized) {
            this.trackEvent(MixpanelEvent.PAGE_VIEW, {
                page,
                ...this.getReferrerData()
            });
        }
    }

    public async trackEvent(
        event: string,
        properties?: Record<string, string | string[] | boolean>
    ): Promise<void> {
        if (!this.hasValidToken || !this.hasConsent()) return;

        const firstPartyTrackingId =
            (getCookie("fp_tracking_id") as string) || uuidv4();
        if (!getCookie("fp_tracking_id")) {
            setCookie("fp_tracking_id", firstPartyTrackingId, {
                maxAge: 60 * 60 * 24 * 365,
                path: "/",
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production"
            });
        }

        const referrerData = this.getReferrerData();

        const eventProperties = {
            ...this.superProperties,
            ...properties,
            datadog_session_url: this.getDatadogSessionUrl(),
            ...this.getInitialReferrerProperties(),
            ...(referrerData && referrerData),
            $device_id: this.deviceId,
            $first_party_tracking_id: firstPartyTrackingId,
            ...this.getBrowserMetadata(),
            ...(this.userId && { $user_id: this.userId })
        };

        await this.sendToApi("trackEvent", event, eventProperties);
    }

    public registerSuperProperties(properties: Record<string, string>): void {
        if (!this.hasValidToken || !this.hasConsent()) return;
        this.superProperties = { ...this.superProperties, ...properties };
    }

    public initializeSuperProperties(): void {
        if (!this.hasValidToken || !this.hasConsent()) return;
        const baseProperties: Record<string, string> = {
            unicity_product: "enrollment",
            user_market: getCookie("country") || "US",
            user_market_extended: getCookie("country") || "US",
            user_language: getCookie("language") || "en",
            ...this.getUtmParameters()
        };

        const refId = getCookie("refId");
        if (refId) {
            baseProperties.enroller_referral_code = refId;
        }

        this.registerSuperProperties(baseProperties);
    }

    public identify(userId: string): void {
        this.userId = userId;
    }

    public async setPeopleProperties(
        properties: Record<string, string | boolean>
    ): Promise<void> {
        if (!this.hasConsent()) return;
        if (!this.userId) {
            console.error("Cannot set people properties without a user ID.");
            return;
        }

        const peopleProperties = {
            $user_id: this.userId,
            ...this.getInitialReferrerProperties(),
            ...this.setInitialUtmProperties(),
            ...properties
        };
        await this.sendToApi("setPeopleProperties", null, peopleProperties);
    }

    public reset(): void {
        this.resetSuperProperties();
        this.userId = null;
        deleteCookie("device_id");
        this.deviceId = this.initializeDeviceId();
        deleteCookie("initial_referrer");
        deleteCookie("initial_referring_domain");
    }

    private async sendToApi(
        action: string,
        event: string | null,
        properties: Record<string, string | string[] | boolean>
    ): Promise<void> {
        try {
            const response = await fetch("/api/mixpanel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, event, properties })
            });
            if (!response.ok)
                console.error(`Failed to ${action}:`, response.statusText);
        } catch (error) {
            console.error(`Error in ${action}:`, error);
        }
    }

    private resetSuperProperties(): void {
        this.superProperties = {};
    }

    private getDatadogSessionUrl(): string {
        const startTime = Date.now();
        const internalContext = datadogRum.getInternalContext();

        if (internalContext?.session_id) {
            return `https://us5.datadoghq.com/rum/replay/sessions/${internalContext.session_id}?applicationId=${process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID}&from=${startTime}`;
        }
        return "";
    }

    private getBrowserMetadata(): Record<string, string | number> {
        if (typeof window === "undefined") return {};

        return {
            $screen_height: window.screen.height,
            $screen_width: window.screen.width,
            $current_url: window.location.href
        };
    }

    private getInitialReferrerProperties(): Record<string, string> {
        const initialReferrer = getCookie("initial_referrer") as string | null;
        const initialReferringDomain = getCookie("initial_referring_domain") as
            | string
            | null;
        return {
            $initial_referrer: initialReferrer || "$direct",
            $initial_referring_domain: initialReferringDomain || "$direct"
        };
    }

    private getUtmParameters(): Record<string, string> {
        if (typeof window === "undefined") return {};

        const url = new URL(window.location.href);
        const params: Record<string, string> = {};

        MixpanelService.UTM_KEYS.forEach(param => {
            const value = url.searchParams.get(param);
            if (value) {
                params[param] = value;
            }
        });

        return params;
    }

    private setInitialUtmProperties(): Record<string, string> {
        return MixpanelService.UTM_KEYS.reduce((acc, key) => {
            const value = this.superProperties[key];
            if (value && value.trim() !== "") {
                return {
                    ...acc,
                    [`initial_${key}`]: value
                };
            }
            return acc;
        }, {});
    }

    private parseReferrerUrl(url: string): ReferrerData | false {
        try {
            return {
                $referrer: url,
                $referring_domain: new URL(url).host
            };
        } catch (error) {
            return false;
        }
    }

    private getNaturalNavigationReferrer(): ReferrerData | false {
        if (!document.referrer) return false;
        return this.parseReferrerUrl(document.referrer);
    }

    private getProgrammaticNavigationReferrer(): ReferrerData | false {
        if (!this.previousPath) return false;
        return this.parseReferrerUrl(this.previousPath);
    }

    private getReferrerData(): ReferrerData | false {
        if (this.getProgrammaticNavigationReferrer())
            return this.getProgrammaticNavigationReferrer();

        if (this.getNaturalNavigationReferrer())
            return this.getNaturalNavigationReferrer();

        return false;
    }
}

const mixpanelService = MixpanelService.getInstance();

export default mixpanelService;
