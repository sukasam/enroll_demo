import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import {
    defaultHomeRedirect,
    handleUrlParamsCookies
} from "Services/utils/urlParamsCookieHandler";

export default function Page(): JSX.Element {
    // This component is primarily for redirection. The actual UI shown here is just a fallback.
    return <div>Redirecting...</div>;
}

export async function getServerSideProps(
    ctx: GetServerSidePropsContext<{
        countryCode: string;
        language: string;
    }>
): Promise<GetServerSidePropsResult<Record<string, string>>> {
    const { params } = ctx;

    if (!params) {
        return defaultHomeRedirect;
    }

    handleUrlParamsCookies(
        ctx,
        {
            countryCode: params.countryCode,
            language: params.language
        },
        {
            setCountry: true,
            setLanguage: true,
            setRef: false
        }
    );

    return defaultHomeRedirect;
}
