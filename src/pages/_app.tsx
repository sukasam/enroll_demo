import CssBaseline from "@mui/material/CssBaseline";
import { useCountryConfig } from "Constants/countryConfig";
import { useTranslations } from "Contexts/translation";
import globalStyles from "Styles/global";
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
    useEffect,
    useRef,
    useState
} from "react";
import TagManager from "react-gtm-module";
import { getAuthToken, validateAuthToken } from "utils/authUtils";
import { KNOWN_ROUTES } from "../constants/routes";
import useInitializeApp from "../hooks/useAppInitialization";
import AppProviders from "../providers/AppProviders";
import "../styles/globals.css";
import { clearAllAppData } from "../utils/cookieUtils";
import {
    getRedirectResult,
    validateProtectedRoute,
    validatePublicOnlyRoute,
    validateThankYouAccess,
    validateThankYouPage
} from "../utils/routeValidation";

interface AppProps {
    Component: React.ComponentType<AppProps["pageProps"]>;
    pageProps: {
        userToken: string;
        refIdCookie: string | null;
    };
}

declare global {
    interface Window {
        onloadCallback?: () => void;
        gtag: (
            command: string,
            action: string,
            params?: Record<string, string>
        ) => void;
    }
}

interface ResetResult {
    shouldRedirect: boolean;
    redirectPath?: string;
    resetScript?: string;
}

function handleResetOperation(appContext: NextAppContext): ResetResult {
    clearAllAppData(appContext.ctx);

    if (typeof window !== "undefined") {
        // Clear local storage
        localStorage.clear();
        // Clear session storage except translation context
        const translationContext = sessionStorage.getItem("translationContext");
        sessionStorage.clear();
        if (translationContext) {
            sessionStorage.setItem("translationContext", translationContext);
        }
    }

    return {
        shouldRedirect: true,
        redirectPath: "/home",
        resetScript: `<script>
            sessionStorage.clear();
            window.location.href = '/home';
        </script>`
    };
}

function App({ Component, pageProps }: AppProps): JSX.Element {
    const { query: language } = useRouter();
    const isInitialMount = useRef(true);
    const router = useRouter();
    const routeChangeTimeout = useRef<NodeJS.Timeout>();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        // Initialize TagManager in useEffect
        if (process.env.NEXT_PUBLIC_GTM_ID) {
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
    }, []);

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
                {isClient ? (
                    <AppContent
                        Component={Component}
                        pageProps={pageProps}
                        isInitialMount={isInitialMount}
                        language={language}
                    />
                ) : null}
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

    useInitializeApp({
        isInitialMount,
        country,
        language,
        isCookieEnabled
    });

    return <Component {...pageProps} />;
}

function ReCaptchaScript(): JSX.Element {
    useEffect(() => {
        // Define the onloadCallback function
        window.onloadCallback = (): void => {
            // This function will be called when reCAPTCHA is loaded
            console.log("reCAPTCHA loaded successfully");
        };

        return () => {
            // Cleanup
            if (window.onloadCallback) {
                delete window.onloadCallback;
            }
        };
    }, []);

    return (
        <Script
            src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit"
            strategy="lazyOnload"
        />
    );
}

function AppWrapper(props: AppProps): JSX.Element {
    return <App {...props} />;
}

async function handleRouteValidation(
    path: string,
    query: { [key: string]: string | string[] | undefined },
    hasUserToken: boolean,
    appContext: NextAppContext
): Promise<{ shouldRedirect: boolean; redirectPath?: string }> {
    if (path === "/reset") {
        const resetResult = handleResetOperation(appContext);
        return {
            shouldRedirect: resetResult.shouldRedirect,
            redirectPath: resetResult.redirectPath
        };
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

export async function getServerSideProps(context: any): Promise<{
    props: {
        pageProps: AppProps["pageProps"];
    };
}> {
    const path = context.pathname || "/";
    const defaultPageProps: AppProps["pageProps"] = {
        userToken: "",
        refIdCookie: null
    };

    if (!context.res) {
        return { props: { pageProps: defaultPageProps } };
    }

    const userToken = getAuthToken();
    const hasUserToken = validateAuthToken(userToken);
    const refIdCookie = getCookie("refId", context) ?? null;
    const { query } = context;

    const { shouldRedirect, redirectPath } = await handleRouteValidation(
        path,
        query,
        hasUserToken,
        context
    );

    if (shouldRedirect && redirectPath) {
        if (path === "/reset") {
            const resetResult = handleResetOperation(context);
            context.res.setHeader("Content-Type", "text/html");
            context.res.write(resetResult.resetScript);
        } else {
            context.res.writeHead(302, { Location: redirectPath });
        }
        context.res.end();
        return { props: { pageProps: defaultPageProps } };
    }

    return {
        props: {
            pageProps: {
                ...defaultPageProps,
                userToken,
                refIdCookie
            }
        }
    };
}

const launchDarklyClientSideID =
    process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID || null;

const useFlagsFallback = (): Record<string, unknown> => ({});

export const useFlags = launchDarklyClientSideID
    ? ldUseFlags
    : useFlagsFallback;

// Custom LaunchDarkly initialization wrapper
const withCustomLDProvider = (
    WrappedComponent: ComponentType<AppProps>
): ComponentType<AppProps> => {
    function CustomLDProvider(props: AppProps): JSX.Element {
        const [isInitialized, setIsInitialized] = useState(false);

        useEffect(() => {
            if (launchDarklyClientSideID) {
                // Set a timeout to handle initialization
                const timeout = setTimeout(() => {
                    setIsInitialized(true);
                }, 1000); // 1 second timeout

                return () => clearTimeout(timeout);
            }
            return undefined;
        }, []);

        if (!launchDarklyClientSideID) {
            return <WrappedComponent {...props} />;
        }

        return (
            <div style={{ display: isInitialized ? "block" : "none" }}>
                <WrappedComponent {...props} />
            </div>
        );
    }

    return CustomLDProvider;
};

const AppWrapperWithLD = launchDarklyClientSideID
    ? withLDProvider({
          clientSideID: launchDarklyClientSideID,
          context: {
              kind: "user",
              key: "all-users"
          },
          options: {
              streaming: false,
              fetchGoals: false,
              bootstrap: "localStorage",
              sendEvents: true,
              diagnosticOptOut: true,
              allAttributesPrivate: true
          }
      })(AppWrapper as unknown as ComponentType)
    : AppWrapper;

export default AppWrapperWithLD;
