import { useCountryConfig } from "Constants/countryConfig";
import { useUser } from "Contexts/UserContext";
import useLoginHooks from "Contexts/hooks/LoginHooks";
import useConsent from "Hooks/useConsent";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";
import isClient from "Services/utils/isClient";
import { useRouter } from "next/router";
import { useEffect } from "react";

function ResetApp(): JSX.Element {
    const { deleteAuthCookie } = useLoginHooks();
    const { resetBacktoDefault } = useUser();
    const router = useRouter();
    const consentData = useConsent();
    const countryConfig = useCountryConfig();
    const hiddenPersonalData =
        !!countryConfig?.marketExceptions?.hiddenPersonalData;

    function clearCookies(): void {
        deleteAuthCookie();

        // need to keep cookies
        const cookiesToKeep = ["language", "country", "cookieyes-consent"];

        document.cookie.split(";").forEach(cookie => {
            const cookieName = cookie.split("=")[0].trim();
            if (!cookiesToKeep.includes(cookieName)) {
                document.cookie = `${cookieName}=;expires=${new Date().toUTCString()};path=/`;
            }
        });
    }

    function clearLocalStorage(): void {
        localStorage.clear();
    }

    function clearSessionStorage(): void {
        const preservedData = {
            translationContext: sessionStorage.getItem("translationContext")
        };
        sessionStorage.clear();
        if (preservedData.translationContext) {
            try {
                sessionStorage.setItem(
                    "translationContext",
                    preservedData.translationContext
                );
            } catch (error) {
                console.error("Failed to restore translationContext:", error);
                window.location.reload();
            }
        } else {
            console.error(
                "Failed to restore translationContext: No preservedData"
            );
            window.location.reload();
        }
    }

    function resetApplication(): void {
        if (isClient()) {
            // Clear all data first
            resetBacktoDefault();
            clearCookies();
            clearLocalStorage();
            clearSessionStorage();

            if (!hiddenPersonalData || consentData?.analytics === "yes") {
                mixpanelService.trackEvent(MixpanelEvent.LOGOUT);
            }
            mixpanelService.reset();

            // Then navigate
            if (router.pathname === "/reset") {
                window.location.href = "/home";
            } else {
                window.location.href = "/login";
            }
        }
    }

    useEffect(() => {
        resetApplication();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div data-testid="logout-container" />;
}

export default ResetApp;
