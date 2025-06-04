import Login from "Components/pages/Login";
import PageSpinner from "Components/shared/PageSpinner";
import {
    PageWrapper,
    PageWrapperServerProps,
    getServerSideProps as pageWrapperServerSideProps
} from "Components/shared/PageWrapper";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { getAuthToken } from "utils/authUtils";

type ServerProps = PageWrapperServerProps;

export default function Page(props: ServerProps): JSX.Element {
    const router = useRouter();
    const token = getAuthToken();
    const [isLoading, setIsLoading] = useState(true);

    const redirectToRegister = useCallback((): void => {
        if (token) {
            router.push("/register");
        }
    }, [router, token]);

    useEffect(() => {
        redirectToRegister();
    }, [redirectToRegister]);

    useEffect(() => {
        if (!token) {
            setIsLoading(false);
        }
    }, [token]);

    if (isLoading) {
        return <PageSpinner data-testid="login-page-spinner" />;
    }

    return (
        <PageWrapper
            {...props}
            title="upgrade_title_home"
            description="website_description_home"
            hideLocale
            background="#f5f8fc"
        >
            <Login />
        </PageWrapper>
    );
}

export async function getServerSideProps(
    ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<ServerProps>> {
    const pageWrapperProps = await pageWrapperServerSideProps(ctx);

    return pageWrapperProps;
}
