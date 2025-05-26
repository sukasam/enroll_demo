import Redirect from "Components/pages/Redirect";
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
            title="redirect_IOU"
            description="website_description_home"
            hideLocale
            background="#f5f8fc"
        >
            <Redirect />
        </PageWrapper>
    );
}

export async function getServerSideProps(
    ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<ServerProps>> {
    const pageWrapperProps = await pageWrapperServerSideProps(ctx);

    return pageWrapperProps;
}
