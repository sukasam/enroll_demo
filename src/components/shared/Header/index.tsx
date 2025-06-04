/** @jsxImportSource @emotion/react */
import BasicHeaderBanner from "Components/shared/Header/components/BasicHeaderBanner";
import MaintenanceBanner from "Components/shared/Header/components/MaintenanceBanner";
import { useTranslate } from "Components/shared/Translate";
import { Alpha2 } from "Constants/countryConfig/enums";
import { useUser } from "Contexts/UserContext";
import { useTranslations } from "Contexts/translation";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Avatar from "./components/Avatar";
import CountryDisplay from "./components/CountryDisplay";
import LanguageSelect from "./components/LanguageSelect";
import ReferralBar from "./components/RefBar";
import useReferralBarVisibility from "./hooks/useReferralBarVisibility";
import styles from "./styles";

export default function Header(): JSX.Element {
    const { isLoggedIn, enrollerId } = useUser();
    const { pathname } = useRouter();
    const showReferralBar =
        useReferralBarVisibility(!!enrollerId) &&
        pathname !== "/home" &&
        pathname !== "/login";
    const logout = async (): Promise<void> => {
        try {
            mixpanelService.trackEvent(MixpanelEvent.LOGOUT, {
                event_location: pathname.replace(/^\//, "")
            });

            // Clear all data and redirect to register page
            window.location.href = "/logout";
        } catch (error) {
            console.error("Logout error:", error);
            window.location.href = "/logout";
        }
    };

    const { country } = useTranslations();
    const translate = useTranslate();

    return (
        <>
            <div css={styles.headerContainer} data-testid="header_container">
                <div css={styles.logoContainer} data-testid="logo_container">
                    <div css={{ display: "block", lineHeight: 0 }}>
                        <Link href="/home" data-testid="header-logo-link">
                            <div>
                                <Image
                                    css={styles.headerLogo}
                                    src="/unicity.svg"
                                    alt="Unicity-Logo"
                                    width={120}
                                    height={30}
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        objectFit: "contain"
                                    }}
                                    data-testid="header-logo-image"
                                    priority
                                    unoptimized
                                />
                            </div>
                        </Link>
                    </div>
                </div>

                {pathname !== "/home" && pathname !== "/login" && (
                    <CountryDisplay />
                )}
                <LanguageSelect />

                {isLoggedIn && pathname !== "/home" && (
                    <div css={styles.userActions} data-testid="user_actions">
                        <Avatar />
                        <button
                            css={styles.logoutButton}
                            onClick={(): void => {
                                logout();
                            }}
                            type="button"
                        >
                            {translate("header_logout")}
                        </button>
                    </div>
                )}
            </div>

            <div css={styles.bannerContainer} data-testid="banner_container">
                {showReferralBar && <ReferralBar />}
                <MaintenanceBanner currentMarket={country as Alpha2} />
                <BasicHeaderBanner
                    currentMarket={country as Alpha2}
                    flagNameLD="technicalDifficultyBanner"
                />
                <BasicHeaderBanner
                    currentMarket={country as Alpha2}
                    flagNameLD="outOfStock"
                />
            </div>
        </>
    );
}
