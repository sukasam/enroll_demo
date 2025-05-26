import { getCookie } from "cookies-next";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { handleUrlParamsCookies } from "Services/utils/urlParamsCookieHandler";

interface ReferralPageProps {
    refId: string | null;
}

interface CookieOptions {
    setCountry: boolean;
    setLanguage: boolean;
    setRef: boolean;
}

/**
 * Handles server-side props for the referral page
 * Sets referral cookie and returns the referral ID
 */
export async function getServerSideProps(
    ctx: GetServerSidePropsContext<{ ref: string }>
): Promise<GetServerSidePropsResult<ReferralPageProps>> {
    try {
        const { params } = ctx;
        const cookieOptions: CookieOptions = {
            setCountry: false,
            setLanguage: false,
            setRef: true
        };

        await handleUrlParamsCookies(ctx, { ref: params?.ref }, cookieOptions);

        return {
            props: {
                refId: params?.ref || null
            }
        };
    } catch (error) {
        console.error("Error in getServerSideProps:", error);
        return {
            props: {
                refId: null
            }
        };
    }
}

/**
 * Handles the redirect logic when both URL ref and cookie ref exist
 */
const handleRedirect = (refId: string | null): void => {
    const cookieRefId = getCookie("refId");
    if (refId && cookieRefId) {
        window.location.href = "/home";
    }
};

/**
 * Referral page component that handles referral links and redirects
 */
export default function ReferralPage({
    refId
}: ReferralPageProps): JSX.Element {
    const router = useRouter();

    useEffect(() => {
        handleRedirect(refId);
        return undefined;
    }, [refId, router]);

    return (
        <div data-testid="referral-page-container">
            <div data-testid="referral-page-loading">
                Processing referral...
            </div>
        </div>
    );
}
