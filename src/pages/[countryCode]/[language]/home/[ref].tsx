import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import {
    defaultHomeRedirect,
    handleUrlParamsCookies
} from "Services/utils/urlParamsCookieHandler";

// eslint-disable-next-line import/prefer-default-export
export async function getServerSideProps(
    ctx: GetServerSidePropsContext<{
        countryCode: string;
        language: string;
        ref: string;
    }>
): Promise<GetServerSidePropsResult<{ redirect: object }>> {
    const { params } = ctx;

    handleUrlParamsCookies(ctx, {
        countryCode: params?.countryCode,
        language: params?.language,
        ref: params?.ref
    });

    return defaultHomeRedirect;
}

export default function Page(): JSX.Element {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
}
