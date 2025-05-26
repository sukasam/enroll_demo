import Login from "Components/pages/Login";
import {
    PageWrapper,
    PageWrapperServerProps,
    getServerSideProps as pageWrapperServerSideProps
} from "Components/shared/PageWrapper";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

type ServerProps = PageWrapperServerProps;

export default function Page(props: ServerProps): JSX.Element {
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
