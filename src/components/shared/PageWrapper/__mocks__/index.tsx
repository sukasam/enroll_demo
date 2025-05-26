import { GetServerSidePropsResult } from "next";
import { ReactNode } from "react";

export type PageWrapperServerProps = {
    translations?: Record<string, string>;
    basicTranslations?: Record<string, string>;
};

type PageWrapperProps = PageWrapperServerProps & {
    children: ReactNode;
    title: string;
    description: string;
    hideLocale?: boolean;
    referralBar?: boolean;
    background: string;
};

export const PageWrapper = jest.fn(({ children }: PageWrapperProps) => (
    <div data-testid="page-wrapper">{children}</div>
));

export const getServerSideProps = jest.fn(
    async (): Promise<GetServerSidePropsResult<PageWrapperServerProps>> => ({
        props: {
            translations: {},
            basicTranslations: {}
        }
    })
);

export default {
    PageWrapper,
    getServerSideProps
};
