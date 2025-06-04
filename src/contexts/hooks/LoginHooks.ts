import { getCountryConfig, useCountryConfig } from "Constants/countryConfig";
import { Alpha2 } from "Constants/countryConfig/enums";
import { useTranslations } from "Contexts/translation";
import { AddressType } from "Contexts/types/OrderContextTypes";
import { UserData } from "Contexts/types/UserContextTypes";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import getMe, { UserResponseType } from "Hydra/getMe";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";
import formatHref from "Services/utils/formatHref";
import { getFullName } from "Services/utils/fullName";
import { getAuthToken } from "utils/authUtils";

// const authCookieName = "_unicityToken_v5";
const authCookieName = "_unicityToken_v5_enroll";

type setLoggedInDataProps = {
    userToken: string;
    setUserData: (userData: UserData) => void;
    setHref: (href: string) => void;
    setUserToken: (userToken: string) => void;
    setEnrollerFullName: (name: string | null) => void;
    setSponsorFullName: (name: string | null) => void;
    setEnrollerId: (id: string | null) => void;
    setSponsorId: (id: string | null) => void;
    setMainAddress: (address: AddressType | null) => void;
};

type useLoginHooksType = {
    setAuthCookie: (token: string | null, options?: { path: string }) => void;
    getUserTokenFromCookie: () => string | null;
    setLoggedInData: (props: setLoggedInDataProps) => void;
    deleteAuthCookie: () => void;
};

export default function useLoginHooks(): useLoginHooksType {
    const { setCountry, setLanguage, country, language } = useTranslations();
    const countryConfig = useCountryConfig();
    const hiddenPersonalData =
        !!countryConfig?.marketExceptions?.hiddenPersonalData;

    const setAuthCookie = (
        token: string | null,
        options = { path: "/" }
    ): void => {
        const NINETY_DAYS = 1000 * 60 * 60 * 24 * 90;
        if (typeof window === "undefined")
            throw new Error(
                "AuthCookie::This method can only be called in the Client/browser"
            );
        if (!token) return;
        const now = new Date().getTime();
        const expires = new Date(now + NINETY_DAYS);
        const cookieOptions = { secure: true, expires, ...options };
        setCookie(authCookieName, token, cookieOptions);
    };

    const getUserTokenFromCookie = (): string | null =>
        getCookie(authCookieName) || null;

    const deleteAuthCookie = (): void => deleteCookie(authCookieName);

    const setMixPanelSignInProperties = (
        userResponse: UserResponseType
    ): void => {
        const unicityId =
            typeof userResponse.id.unicity === "object"
                ? (userResponse.id.unicity as { unicity: string }).unicity
                : userResponse.id.unicity;

        mixpanelService.identify(unicityId);

        if (!hiddenPersonalData) {
            mixpanelService.setPeopleProperties({
                $email: userResponse.email,
                $name: userResponse.humanName.fullName
            });
        }

        const customerType =
            new Date(userResponse.joinDate) <
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ? "upgrader"
                : "enroller";
        const enrollerId =
            typeof userResponse.enroller.id === "object"
                ? (userResponse.enroller.id as { unicity: string }).unicity
                : userResponse.enroller.id;
        const sponsorId =
            typeof userResponse.sponsor.id === "object"
                ? (userResponse.sponsor.id as { unicity: string }).unicity
                : userResponse.sponsor.id;

        mixpanelService.registerSuperProperties({
            customer_type: customerType,
            enroller_id: enrollerId,
            sponsor_id: sponsorId || enrollerId,
            user_market: userResponse.market || country,
            user_market_extended:
                userResponse.mainAddress.state === "PR" &&
                userResponse.mainAddress.country === "US"
                    ? "PR"
                    : userResponse.market || country,
            user_language: language
        });

        mixpanelService.setPeopleProperties({
            unicity_id: unicityId,
            enroller_id: enrollerId,
            sponsor_id: sponsorId || enrollerId,
            user_market: userResponse.market || country,
            user_market_extended:
                userResponse.mainAddress.state === "PR" &&
                userResponse.mainAddress.country === "US"
                    ? "PR"
                    : userResponse.market || country,
            user_language: language,
            membership_registration_date: userResponse.joinDate,
            enr_customer_type: customerType
        });

        const token = getAuthToken();
        if (!token) {
            mixpanelService.trackEvent(MixpanelEvent.SIGN_IN_COMPLETED, {
                event_location: "login",
                already_a_distributor:
                    userResponse?.type?.toLowerCase() === "associate"
            });
        }
    };

    const setLoggedInData = async ({
        userToken,
        setUserData,
        setHref,
        setUserToken,
        setEnrollerFullName,
        setSponsorFullName,
        setEnrollerId,
        setSponsorId,
        setMainAddress
    }: setLoggedInDataProps): Promise<void> => {
        const userResponse = await getMe(userToken);

        if (userResponse.ok === false) {
            throw new Error("failed_to_fetch_user_data");
        }

        const determineSelectedLanguage = (
            userResponse: UserResponseType
        ): string => {
            const currentLanguage = getCookie("language") as string;
            const preferredLanguage =
                userResponse?.preferredLocale?.split("-")[0] || "en";
            return currentLanguage || preferredLanguage;
        };

        // determine final language
        const determineFinalLanguage = (
            selectedLanguage: string,
            selectedCountryData: any
        ): string => {
            const isLanguageSupported = selectedCountryData?.languages?.some(
                (lang: { code: string }) =>
                    lang.code.toLowerCase() === selectedLanguage.toLowerCase()
            );

            return isLanguageSupported
                ? selectedLanguage
                : selectedCountryData?.languages?.find(
                      (lang: { default: boolean }) => lang.default
                  )?.code || "en";
        };

        const preferredLanguage = determineSelectedLanguage(userResponse);

        const selectedCountryData = getCountryConfig(
            userResponse.market as Alpha2,
            true
        );

        const finalLanguage = determineFinalLanguage(
            preferredLanguage,
            selectedCountryData
        );
        setMixPanelSignInProperties(userResponse);

        if (!selectedCountryData && userResponse.market) {
            throw new Error("market_not_supported");
        }
        if (userResponse?.type?.toLowerCase() === "associate") {
            throw new Error("allready_a_distributor");
        }
        if (userResponse?.type?.toLowerCase() !== "member") {
            throw new Error("user_type_not_supported");
        }
        if (!selectedCountryData && !userResponse.market) {
            throw new Error("Login failed");
        }

        if (
            userResponse?.mainAddress?.country === "US" &&
            userResponse?.mainAddress?.state === "PR"
        )
            setCountry("PR");
        else setCountry(userResponse.market);

        setUserToken(userToken);
        setEnrollerId(userResponse.enroller.id);
        setUserData({
            firstName:
                userResponse.market === "JP"
                    ? userResponse.humanName["fullName@ja"]
                    : userResponse.humanName.firstName,
            lastName:
                userResponse.market === "JP"
                    ? `${userResponse.humanName.lastName} ${userResponse.humanName.firstName}`
                    : userResponse.humanName.lastName,
            phoneNumber: userResponse.mobilePhone,
            email: userResponse.email,
            fullName:
                userResponse.market === "JP"
                    ? `${userResponse.humanName.lastName} ${userResponse.humanName.firstName}`
                    : `${userResponse.humanName.firstName} ${userResponse.humanName.lastName}`,
            unicityId: userResponse.id.unicity
        });
        setLanguage(finalLanguage);
        setSponsorId(userResponse.sponsor.id);
        setEnrollerFullName(getFullName(userResponse.enroller.humanName));
        setSponsorFullName(getFullName(userResponse.sponsor.humanName));
        setHref(formatHref(userResponse.href));
        setMainAddress(userResponse.mainAddress);
    };

    return {
        getUserTokenFromCookie,
        setAuthCookie,
        setLoggedInData,
        deleteAuthCookie
    };
}
