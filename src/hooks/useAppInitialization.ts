import { getCookie } from "cookies-next";
import useConsent from "Hooks/useConsent";
import { MutableRefObject, useEffect, useRef } from "react";
import { initializeLoggingService } from "Services/datadog/datadogLoggingService";
import initializeDatadog from "Services/datadog/initializeDatadog";
import { sendEvent } from "Services/googleAnalytics";
import { initVlog } from "Services/utils/verboseLogger";
import { CacheManager } from "utils/cacheManager";
import { useEnroller, useInitialReferrer } from "../pages/_app.hooks";

interface InitializeAppProps {
    isInitialMount: MutableRefObject<boolean>;
    country: string;
    language: { [key: string]: string | string[] | undefined };
    isCookieEnabled: boolean;
}

export default function useInitializeApp({
    isInitialMount,
    country,
    language,
    isCookieEnabled
}: InitializeAppProps): void {
    const mountRef = useRef(isInitialMount.current);

    useCacheInitialization();
    useAnalyticsInitialization(mountRef, country, language);
    useMonitoringInitialization(isCookieEnabled);
    useConsent();

    initVlog();
    useEnroller();
    useInitialReferrer();
}

function useCacheInitialization(): void {
    useEffect(() => {
        const initializeCache = async (): Promise<void> => {
            try {
                await CacheManager.handleVersionMismatch();
                await CacheManager.checkPendingReload();
            } catch (error) {
                console.error("Error initializing cache:", error);
            }
        };
        initializeCache();
    }, []);
}

function useAnalyticsInitialization(
    mountRef: MutableRefObject<boolean>,
    country: string,
    language: { [key: string]: string | string[] | undefined }
): void {
    const localMountRef = useRef(mountRef.current);
    const consentData = useConsent();

    useEffect(() => {
        const shouldSendEvent = !localMountRef.current;
        localMountRef.current = false;

        if (shouldSendEvent) {
            const languageFromCookie = getCookie("language") || language;
            const countryFromCookie = getCookie("country") || country;

            if (typeof window !== "undefined" && window.gtag) {
                const analyticsConsent =
                    consentData?.analytics === "yes" ? "granted" : "denied";
                window.gtag("consent", "update", {
                    analytics_storage: analyticsConsent,
                    ad_storage: analyticsConsent
                });
            }

            sendEvent("page_configration", {
                country: countryFromCookie,
                language: languageFromCookie
            });
        }
    }, [country, language, consentData]);
}

function useMonitoringInitialization(isCookieEnabled: boolean): void {
    const consentData = useConsent();

    const isValidEnvironment = ["production", "development"].includes(
        process.env.NEXT_PUBLIC_DATADOG_ENV || ""
    );

    useEffect(() => {
        if (!isValidEnvironment) return;

        const hasConsent = consentData?.analytics === "yes";
        const shouldInitialize = !isCookieEnabled || hasConsent;

        if (shouldInitialize) {
            initializeDatadog();
            setTimeout(() => {
                initializeLoggingService();
            }, 0);
        }
    }, [isValidEnvironment, isCookieEnabled, consentData?.analytics]);
}
