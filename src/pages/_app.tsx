import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { useCountryConfig } from "Constants/countryConfig";
import { OrderProvider } from "Contexts/OrderContext";
import { ProductProvider } from "Contexts/ProductContext";
import { UserProvider } from "Contexts/UserContext";
import { TranslationProvider, useTranslations } from "Contexts/translation";
import useConsent from "Hooks/useConsent";
import { initializeLoggingService } from "Services/datadog/datadogLoggingService";
import initializeDatadog from "Services/datadog/initializeDatadog";
import { sendEvent } from "Services/googleAnalytics";
import { initVlog } from "Services/utils/verboseLogger";
import globalStyles from "Styles/global";
import { lightTheme } from "Styles/theme/themes";
import AppHead from "components/common/AppHead";
import { getCookie, setCookie } from "cookies-next";
import {
    useFlags as ldUseFlags,
    withLDProvider
} from "launchdarkly-react-client-sdk";
import { AppContext as NextAppContext } from "next/app";
import { useRouter } from "next/router";
import Script from "next/script";
import {
    ComponentType,
    MutableRefObject,
    ReactNode,
    useEffect,
    useRef
} from "react";
import TagManager from "react-gtm-module";
import { getAuthToken, validateAuthToken } from "utils/authUtils";
import { CacheManager } from "utils/cacheManager";
import { KNOWN_ROUTES } from "../constants/routes";
import "../styles/globals.css";
import { clearAllAppData } from "../utils/cookieUtils";
import {
    getRedirectResult,
    validateProtectedRoute,
    validatePublicOnlyRoute,
    validateThankYouAccess,
    validateThankYouPage
} from "../utils/routeValidation";
import { useEnroller, useInitialReferrer } from "./_app.hooks";

if (typeof document !== "undefined" && process.env.NEXT_PUBLIC_GTM_ID) {
    TagManager.initialize({
        gtmId: process.env.NEXT_PUBLIC_GTM_ID,
        dataLayer: {
            consent_mode: {
                analytics_storage: "denied",
                ad_storage: "denied"
            }
        }
    });
}

interface AppProps {
    Component: React.ComponentType<AppProps["pageProps"]>;
    pageProps: {
        userToken: string;
        refIdCookie: string | null;
    };
}

interface AppWrapperProps {
    children?: ReactNode;
    Component: ComponentType<AppProps["pageProps"]>;
    pageProps: AppProps["pageProps"];
}

interface AppProvidersProps {
    children: ReactNode;
}

declare global {
    interface Window {
        onloadCallback: () => void;
        gtag: (
            command: string,
            action: string,
            params?: Record<string, string>
        ) => void;
    }
}

function App({ Component, pageProps }: AppProps): JSX.Element {
    const { query: language } = useRouter();
    const isInitialMount = useRef(true);
    const router = useRouter();
    const routeChangeTimeout = useRef<NodeJS.Timeout>();

    useEffect(() => {
        const timeoutRef = routeChangeTimeout;

        const handleRouteChangeError = (err: Error): void => {
            if (err.message === "Loading initial props cancelled") {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
            }
        };

        const handleRouteChangeStart = (): void => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };

        router.events.on("routeChangeError", handleRouteChangeError);
        router.events.on("routeChangeStart", handleRouteChangeStart);

        return () => {
            router.events.off("routeChangeError", handleRouteChangeError);
            router.events.off("routeChangeStart", handleRouteChangeStart);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [router]);

    return (
        <div data-testid="app-root">
            <AppHead />
            <ReCaptchaScript />
            {globalStyles}
            <CssBaseline />
            <AppProviders>
                <AppContent
                    Component={Component}
                    pageProps={pageProps}
                    isInitialMount={isInitialMount}
                    language={language}
                />
            </AppProviders>
        </div>
    );
}

interface AppContentProps {
    Component: React.ComponentType<AppProps["pageProps"]>;
    pageProps: AppProps["pageProps"];
    isInitialMount: MutableRefObject<boolean>;
    language: { [key: string]: string | string[] | undefined };
}

function AppContent({
    Component,
    pageProps,
    isInitialMount,
    language
}: AppContentProps): JSX.Element {
    const { country } = useTranslations();
    const countryConfig = useCountryConfig();

    const isCookieEnabled = Boolean(countryConfig?.marketExceptions?.useCookie);
    setCookie("isCookieEnabled", isCookieEnabled);

    useInitializeApp(isInitialMount, country, language, isCookieEnabled);
    useReCaptchaInitialization();

    return <Component {...pageProps} />;
}

function useReCaptchaInitialization(): void {
    useEffect((): void => {
        window.onloadCallback = (): void => {
            // ReCaptcha loaded callback
        };
    }, []);
}

function ReCaptchaScript(): JSX.Element {
    return (
        <Script
            src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit"
            strategy="lazyOnload"
            onLoad={(): void => {
                if (window.onloadCallback) {
                    window.onloadCallback();
                }
            }}
        />
    );
}

function useInitializeApp(
    isInitialMount: MutableRefObject<boolean>,
    country: string,
    language: { [key: string]: string | string[] | undefined },
    isCookieEnabled: boolean
): void {
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
                // console.error("Error initializing cache:", error);
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
            // Initialize Datadog RUM first
            initializeDatadog();
            // Then initialize logging service
            setTimeout(() => {
                initializeLoggingService();
            }, 0);
        }
    }, [isValidEnvironment, isCookieEnabled, consentData?.analytics]);
}

function AppProviders({ children }: AppProvidersProps): JSX.Element {
    return (
        <ThemeProvider theme={lightTheme}>
            <TranslationProvider>
                <ProductProvider>
                    <OrderProvider>
                        <UserProvider>{children}</UserProvider>
                    </OrderProvider>
                </ProductProvider>
            </TranslationProvider>
        </ThemeProvider>
    );
}

function AppWrapper(props: AppWrapperProps): JSX.Element {
    return <App {...props} />;
}

async function handleRouteValidation(
    path: string,
    query: { [key: string]: string | string[] | undefined },
    hasUserToken: boolean
): Promise<{ shouldRedirect: boolean; redirectPath?: string }> {
    if (path === "/reset") {
        return { shouldRedirect: true, redirectPath: "/home" };
    }

    if (validateProtectedRoute(path) && !hasUserToken) {
        return { shouldRedirect: true, redirectPath: "/login" };
    }

    if (validatePublicOnlyRoute(path) && hasUserToken) {
        return { shouldRedirect: true, redirectPath: "/home" };
    }

    if (validateThankYouPage(path)) {
        if (!validateThankYouAccess(query)) {
            return { shouldRedirect: true, redirectPath: "/home" };
        }
        const redirectResult = getRedirectResult(query);
        if (redirectResult) {
            return { shouldRedirect: true, redirectPath: redirectResult };
        }
    }

    const isKnownRoute = KNOWN_ROUTES.some(route => path?.includes(route));
    if (!isKnownRoute) {
        return { shouldRedirect: true, redirectPath: "/home" };
    }

    return { shouldRedirect: false };
}

AppWrapper.getInitialProps = async (
    appContext: NextAppContext
): Promise<{ pageProps: AppProps["pageProps"] }> => {
    const path = appContext.ctx.pathname || "/";
    const defaultPageProps: AppProps["pageProps"] = {
        userToken: "",
        refIdCookie: null
    };

    if (!appContext.ctx.res) {
        return { pageProps: defaultPageProps };
    }

    const userToken = getAuthToken();
    const hasUserToken = validateAuthToken(userToken);
    const refIdCookie = getCookie("refId", appContext.ctx) ?? null;
    const { query } = appContext.ctx;

    const { shouldRedirect, redirectPath } = await handleRouteValidation(
        path,
        query,
        hasUserToken
    );

    if (shouldRedirect && redirectPath) {
        if (path === "/reset") {
            clearAllAppData(appContext.ctx);
            appContext.ctx.res.setHeader("Content-Type", "text/html");
            appContext.ctx.res.write(`<script>
                sessionStorage.clear();
                window.location.href = '/home';
            </script>`);
        } else {
            appContext.ctx.res.writeHead(302, { Location: redirectPath });
        }
        appContext.ctx.res.end();
        return { pageProps: defaultPageProps };
    }

    return {
        pageProps: {
            ...defaultPageProps,
            userToken,
            refIdCookie
        }
    };
};

const launchDarklyClientSideID =
    process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID || null;

const useFlagsFallback = (): Record<string, unknown> => ({});

export const useFlags = launchDarklyClientSideID
    ? ldUseFlags
    : useFlagsFallback;

const AppWrapperWithLD = launchDarklyClientSideID
    ? withLDProvider({
          clientSideID: launchDarklyClientSideID,
          context: {
              kind: "user",
              key: "all-users"
          },
          options: {
              streaming: false,
              fetchGoals: false
          }
      })(AppWrapper as unknown as ComponentType)
    : AppWrapper;

const test = (): JSX.Element => <div>test</div>;

export default AppWrapperWithLD;
