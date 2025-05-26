import Cookies from "js-cookie";

interface CacheVersion {
    version: string;
    timestamp: number;
}

// Define interface for webkitStorageInfo
interface WebkitStorageInfo {
    TEMPORARY: number;
    PERSISTENT: number;
    queryUsageAndQuota: (
        type: number,
        callback: (usage: number, quota: number) => void
    ) => void;
}

const DEFAULT_VERSION = "1.0.0";

export const CACHE_VERSION =
    process.env.NEXT_PUBLIC_BUILD_ID || DEFAULT_VERSION;

export class CacheManager {
    private static readonly VERSION_COOKIE_NAME = "app_version";

    private static readonly CACHE_VERSION_KEY = "cache_version";

    private static readonly RELOAD_PENDING_KEY = "reload_pending";

    private static readonly UPDATE_NOTIFICATION_KEY = "update_notification";

    private static readonly REDIRECT_COUNT_KEY = "redirect_count";

    private static readonly ALLOW_GUIDE_COOKIE = "allowGuide";

    private static readonly MAX_REDIRECTS = 3;

    private static readonly PRESERVED_COOKIES = [
        "language",
        "country",
        "cookieyes-consent"
    ];

    // Add sensitive routes that shouldn't be immediately reloaded
    private static readonly SENSITIVE_ROUTES = [
        "/checkout",
        "/payment",
        "/enrollment/form"
    ];

    // Add routes that need special handling for redirect loops
    private static readonly REDIRECT_SENSITIVE_ROUTES = [
        "/register",
        "/login",
        "/home"
    ];

    // Platform-specific cache clearing strategies
    private static readonly PLATFORM_SPECIFIC = {
        ios: {
            clearStorage: async (): Promise<void> => {
                if ("webkitStorageInfo" in window) {
                    const storageInfo = (
                        window as { webkitStorageInfo: WebkitStorageInfo }
                    ).webkitStorageInfo;
                    await new Promise<void>(resolve => {
                        storageInfo.queryUsageAndQuota(
                            storageInfo.TEMPORARY,
                            () => resolve()
                        );
                    });
                }
            }
        },
        android: {
            clearStorage: async (): Promise<void> => {
                if ("webkitStorageInfo" in window) {
                    const storageInfo = (
                        window as { webkitStorageInfo: WebkitStorageInfo }
                    ).webkitStorageInfo;
                    await new Promise<void>(resolve => {
                        storageInfo.queryUsageAndQuota(
                            storageInfo.TEMPORARY,
                            () => resolve()
                        );
                    });
                }
            }
        }
    };

    static async clearAllCache(forceClear = false): Promise<void> {
        try {
            // Check for redirect loops
            if (!forceClear && this.isInRedirectLoop()) {
                console.warn(
                    "Detected potential redirect loop, preventing cache clear"
                );
                return;
            }

            // Store preserved cookies
            const preservedCookieValues = this.PRESERVED_COOKIES.reduce(
                (acc, cookieName) => {
                    const value = Cookies.get(cookieName);
                    if (value) {
                        acc[cookieName] = value;
                    }
                    return acc;
                },
                {} as Record<string, string>
            );

            // Clear browser cache using Cache API
            if ("caches" in window) {
                const cacheKeys = await caches.keys();
                await Promise.all(cacheKeys.map(key => caches.delete(key)));
            }

            // Clear Service Worker if exists
            if ("serviceWorker" in navigator) {
                const registrations =
                    await navigator.serviceWorker.getRegistrations();
                await Promise.all(
                    registrations.map(registration => registration.unregister())
                );
            }

            // Clear local storage except for critical items
            const criticalData = {
                redirectCount: localStorage.getItem(this.REDIRECT_COUNT_KEY)
            };
            localStorage.clear();
            if (criticalData.redirectCount) {
                localStorage.setItem(
                    this.REDIRECT_COUNT_KEY,
                    criticalData.redirectCount
                );
            }

            // Clear session storage with preservation
            const translationContext =
                sessionStorage.getItem("translationContext");
            const preservedData = {
                translationContext
            };

            sessionStorage.clear();

            if (preservedData.translationContext) {
                try {
                    sessionStorage.setItem(
                        "translationContext",
                        preservedData.translationContext
                    );
                } catch (error) {
                    console.error(
                        "Failed to restore translationContext:",
                        error
                    );
                    window.location.reload();
                }
            } else {
                console.error(
                    "Failed to restore translationContext: No preservedData"
                );
                window.location.reload();
            }

            // Clear all cookies except preserved ones
            const cookies = Cookies.get();
            Object.keys(cookies).forEach(cookie => {
                if (!this.PRESERVED_COOKIES.includes(cookie)) {
                    Cookies.remove(cookie, { path: "/" });
                }
            });

            // Restore preserved cookies (except cookieyes-consent)
            Object.entries(preservedCookieValues).forEach(([name, value]) => {
                if (name !== "cookieyes-consent") {
                    Cookies.set(name, value, {
                        expires: 365,
                        path: "/"
                    });
                }
            });

            // Clear platform-specific storage
            const platform = this.detectPlatform();
            if (platform && this.PLATFORM_SPECIFIC[platform]) {
                await this.PLATFORM_SPECIFIC[platform].clearStorage();
            }

            // Reset redirect count after successful clear
            if (forceClear) {
                localStorage.removeItem(this.REDIRECT_COUNT_KEY);
            }

            // Set new version
            this.setVersion();

            console.log("Cache and cookies cleared successfully");
        } catch (error) {
            console.error("Error clearing cache and cookies:", error);
            throw error;
        }
    }

    private static isInRedirectLoop(): boolean {
        const currentPath = window.location.pathname;
        if (!this.REDIRECT_SENSITIVE_ROUTES.includes(currentPath)) {
            return false;
        }

        const redirectCount = parseInt(
            localStorage.getItem(this.REDIRECT_COUNT_KEY) || "0",
            10
        );
        localStorage.setItem(
            this.REDIRECT_COUNT_KEY,
            (redirectCount + 1).toString()
        );

        if (redirectCount >= this.MAX_REDIRECTS) {
            // Reset count and force a clean state
            localStorage.removeItem(this.REDIRECT_COUNT_KEY);
            this.clearAllCache(true).catch(console.error);
            return true;
        }

        return false;
    }

    private static detectPlatform(): "ios" | "android" | null {
        const userAgent = navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(userAgent)) {
            return "ios";
        }
        if (/android/.test(userAgent)) {
            return "android";
        }
        return null;
    }

    static setVersion(): void {
        const versionData: CacheVersion = {
            version: CACHE_VERSION,
            timestamp: Date.now()
        };

        // Store version in both localStorage and cookies for redundancy
        localStorage.setItem(
            this.CACHE_VERSION_KEY,
            JSON.stringify(versionData)
        );
        Cookies.set(this.VERSION_COOKIE_NAME, CACHE_VERSION, {
            expires: 7,
            secure: true,
            sameSite: "strict"
        });
    }

    static checkVersion(): boolean {
        if (!this.hasStoredVersion()) {
            return false;
        }

        const storedVersionData = localStorage.getItem(this.CACHE_VERSION_KEY);
        const cookieVersion = Cookies.get(this.VERSION_COOKIE_NAME);

        if (!storedVersionData || !cookieVersion) {
            return false;
        }

        try {
            const { version } = JSON.parse(storedVersionData) as CacheVersion;
            return version === CACHE_VERSION && cookieVersion === CACHE_VERSION;
        } catch {
            return false;
        }
    }

    private static hasStoredVersion(): boolean {
        return !!(
            localStorage.getItem(this.CACHE_VERSION_KEY) &&
            Cookies.get(this.VERSION_COOKIE_NAME)
        );
    }

    static async handleVersionMismatch(): Promise<void> {
        if (
            process.env.NODE_ENV === "development" &&
            !process.env.NEXT_PUBLIC_BUILD_ID
        ) {
            return;
        }

        const hasStoredVersion = this.hasStoredVersion();
        const isVersionMatch = this.checkVersion();

        if (!hasStoredVersion) {
            // No version found - set new version and clear all cache
            this.setVersion();
            await this.clearAllCache(true);
            return;
        }

        if (!isVersionMatch) {
            // Version mismatch - clear cache and reload
            await this.clearAllCache(true);
            this.showUpdateNotification();
            window.location.reload();
        }
    }

    private static showUpdateNotification(): void {
        const notification = document.createElement("div");
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        notification.textContent =
            "A new version is available. The page will refresh to update.";
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    static checkPendingReload(): void {
        const pendingReload = localStorage.getItem(this.RELOAD_PENDING_KEY);
        if (pendingReload === "true") {
            localStorage.removeItem(this.RELOAD_PENDING_KEY);
            this.handleVersionMismatch();
        }
    }

    static setAllowGuideCookie(): void {
        if (typeof window === "undefined") return;

        const urlParams = new URLSearchParams(window.location.search);
        const allowGuide = urlParams.get("allowGuide");

        if (allowGuide === "true") {
            Cookies.set(this.ALLOW_GUIDE_COOKIE, "true", {
                expires: 365, // Cookie expires in 1 year
                path: "/",
                secure: true,
                sameSite: "strict"
            });
        }
    }
}

// Initialize version check on app load
if (typeof window !== "undefined") {
    CacheManager.handleVersionMismatch().catch(console.error);
    CacheManager.setAllowGuideCookie();
}
