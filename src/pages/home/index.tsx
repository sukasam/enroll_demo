import Home, {
    HomeServerProps,
    getServerSideProps as homeServerSideProps
} from "Components/pages/Home";
import {
    PageWrapper,
    PageWrapperServerProps,
    getServerSideProps as pageWrapperServerSideProps
} from "Components/shared/PageWrapper";
import { merge } from "lodash-es";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

type ServerProps = PageWrapperServerProps & HomeServerProps;

export default function Page(props: ServerProps): JSX.Element {
    return (
        <PageWrapper
            {...props}
            title="upgrade_title_home"
            description="website_description_home"
            hideLocale
            background="#f5f8fc"
        >
            <Home {...props} />
        </PageWrapper>
    );
}

export async function getServerSideProps(
    ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<ServerProps>> {
    const homeProps = await homeServerSideProps(ctx);
    const pageWrapperProps = await pageWrapperServerSideProps(ctx);

    return merge(homeProps, pageWrapperProps);
}
