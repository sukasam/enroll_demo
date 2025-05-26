/** @jsxImportSource @emotion/react */
import { Grid } from "@mui/material";
import { getValidatedLocale } from "Constants/countryConfig";
import { Alpha2 } from "Constants/countryConfig/enums";
import { useUser } from "Contexts/UserContext";
import { useTranslations } from "Contexts/translation";
import { Customer } from "Hydra/getRefID";
import geoLookup from "Services/geoip";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import { getFullName } from "Services/utils/fullName";
import isRefValid from "Services/utils/refValidation";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import useHashNavigation from "hooks/useHashNavigation";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import Aside from "./components/Aside";
import HomeContent from "./components/HomeContent";
import styles from "./styles";

export interface HomeServerProps {
    referrer: Customer | null;
    refId: string | null;
    country: string;
    language: string;
}

interface LocaleData {
    country: string;
    language: string;
}

interface ReferralData {
    referrer: Customer | null;
    refId: string | null;
}
function collectInitialData(ctx: GetServerSidePropsContext): {
    urlParams: {
        countryCode: string;
        language: string;
        ref: string;
    };
    cookieData: {
        country: string;
        language: string;
        refId: string | undefined;
    };
} {
    const urlParams = {
        countryCode: ctx?.query?.countryCode as string,
        language: ctx?.query?.language as string,
        ref: ctx?.query?.ref as string
    };

    const cookieData = {
        country: (getCookie("country", ctx) || "") as string,
        language: (getCookie("language", ctx) || "") as string,
        refId: getCookie("refId", ctx)
    };

    return { urlParams, cookieData };
}

async function determineLocalePreference(
    urlParams: { countryCode: string; language: string },
    cookieData: { country: string; language: string },
    ctx: GetServerSidePropsContext
): Promise<{ initialCountry: Alpha2; initialLanguage: string }> {
    const geoLocation = await geoLookup(ctx.req);

    const initialCountry = (
        urlParams.countryCode ||
        cookieData.country ||
        geoLocation?.alpha2 ||
        Alpha2.US
    ).toUpperCase() as Alpha2;

    const initialLanguage =
        urlParams.language ||
        geoLocation?.language ||
        cookieData.language ||
        "en";

    return { initialCountry, initialLanguage };
}

function validateAndFinalizeLocale(
    initialCountry: Alpha2,
    initialLanguage: string
): LocaleData {
    const { countryCode: validatedCountry, language: validatedLanguage } =
        getValidatedLocale(initialCountry, initialLanguage);

    return {
        country: validatedCountry || Alpha2.US,
        language: validatedLanguage || "en"
    };
}

function setLocaleCookies(
    ctx: GetServerSidePropsContext,
    locale: LocaleData
): void {
    setCookie("country", locale.country, ctx);
    setCookie("language", locale.language, ctx);
}

async function processReferralData(
    urlRef: string,
    cookieRef: string | undefined
): Promise<ReferralData> {
    const initialRefId = urlRef || cookieRef;
    if (!initialRefId) {
        return { referrer: null, refId: null };
    }

    const { isValid, unicityID, refResults } = await isRefValid(initialRefId);
    return {
        referrer: isValid ? refResults : null,
        refId: isValid ? unicityID : null
    };
}

function setReferralCookies(
    ctx: GetServerSidePropsContext,
    refData: ReferralData
): void {
    if (refData.refId) {
        setCookie("refId", refData.refId, ctx);
        setCookie("isReferred", "true", ctx);
    } else {
        deleteCookie("refId", ctx);
        deleteCookie("isReferred", ctx);
    }
}

export async function getServerSideProps(
    ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<HomeServerProps>> {
    // 1. Collect all initial data
    const { urlParams, cookieData } = collectInitialData(ctx);

    // 2. Determine locale preference
    const { initialCountry, initialLanguage } = await determineLocalePreference(
        urlParams,
        cookieData,
        ctx
    );

    // 3. Validate and finalize locale
    const finalLocale = validateAndFinalizeLocale(
        initialCountry,
        initialLanguage
    );

    // 4. Set locale cookies
    setLocaleCookies(ctx, finalLocale);

    // 5. Process referral data
    const referralData = await processReferralData(
        urlParams.ref,
        cookieData.refId
    );

    // 6. Set referral cookies
    setReferralCookies(ctx, referralData);

    return {
        props: {
            ...referralData,
            ...finalLocale
        }
    };
}

export default function Home(props: HomeServerProps): JSX.Element {
    const { referrer, refId, country, language } = props;
    const {
        enrollerFullName,
        setEnrollerId,
        setSponsorId,
        setEnrollerFullName,
        setSponsorFullName,
        isUserContextLoading
    } = useUser();
    const { setCountry, setLanguage } = useTranslations();
    const router = useRouter();
    const { isHashProcessed } = useHashNavigation();
    const isNavigating = useRef(false);

    // Handle initial server-side props
    useEffect(() => {
        // Only set from props if we don't have a hash
        if (!window.location.hash) {
            if (country) {
                setCountry(country.toUpperCase());
            }
            if (language) {
                setLanguage(language);
            }
        }
    }, [country, language, setCountry, setLanguage]);

    // Handle referrer data
    useEffect(() => {
        if (isUserContextLoading || !isHashProcessed || isNavigating.current)
            return;

        if (refId && referrer) {
            setEnrollerId(refId);
            setEnrollerFullName(getFullName(referrer?.humanName));
            setSponsorId(refId);
            setSponsorFullName(getFullName(referrer?.humanName));
        } else {
            setEnrollerId("");
            setEnrollerFullName("");
            setSponsorId("");
            setSponsorFullName("");
        }
        mixpanelService.trackPageView("home");

        // Use a timeout to prevent rapid navigation attempts
        const timeoutId = setTimeout((): void => {
            isNavigating.current = true;
            router.prefetch("/register");
        }, 100);

        /* eslint-disable-next-line */
        return () => {
            clearTimeout(timeoutId);
        };
    }, [
        isUserContextLoading,
        isHashProcessed,
        refId,
        referrer,
        setEnrollerFullName,
        setEnrollerId,
        setSponsorFullName,
        setSponsorId,
        router
    ]);

    if (!isHashProcessed && !enrollerFullName) {
        return <div>Loading...</div>;
    }

    return (
        <Grid container css={styles} spacing={4}>
            <Grid item md={8} xs={12}>
                <HomeContent refId={refId} referrer={referrer} />
            </Grid>
            <Grid
                className="aside-wrapper"
                data-testid="starting_business_just_become_easier_section"
                item
                md={4}
                xs={12}
            >
                <Aside />
            </Grid>
        </Grid>
    );
}
