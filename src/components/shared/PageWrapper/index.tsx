/**
 * PageWrapper
 *
 * This component is used to wrap all pages.
 * It gives us more control over the page layout than when using _app.tsx
 * with getInitialProps which run both on the server and the client.
 *
 * In Next 13 we probably will be able to migrate away from this component
 * into a layout component.
 */

import { useTranslations } from "Contexts/translation";
import { translationsSvc } from "Hydra/translationsSvc";
import geoLookup from "Services/geoip";
import serverStore from "Services/serverStore/serverStore";
import { getCookie } from "cookies-next";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Head from "next/head";
import { ReactNode, useEffect } from "react";
import Footer from "../Footer";
import Header from "../Header";
import MainLayout from "../MainLayout";
import NoSSR from "../NoSSR";
import Toaster from "../Toaster";
import { useTranslate } from "../Translate";

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

export function PageWrapper(props: PageWrapperProps): JSX.Element {
    const {
        children,
        basicTranslations,
        translations,
        title,
        description,
        background
    } = props;

    const { setCountry, setLanguage, setTranslations, setBasicTranslations } =
        useTranslations();

    useEffect(() => {
        setTranslations(translations || {});
        setBasicTranslations(basicTranslations || {});
    }, [
        translations,
        basicTranslations,
        setCountry,
        setLanguage,
        setTranslations,
        setBasicTranslations
    ]);

    const translate = useTranslate(translations as never);

    return (
        <>
            <Head>
                <title>{translate(title)}</title>
                <meta content={translate(description)} name="description" />

                <meta content={translate(title)} property="og:title" />
                <meta
                    content={translate(description)}
                    property="og:description"
                />
            </Head>
            <NoSSR>
                <Header />
            </NoSSR>
            <Toaster autoClose={false} theme="colored" closeOnClick />
            <MainLayout background={background}>{children}</MainLayout>
            <Footer />
        </>
    );
}

export async function getServerSideProps(
    context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PageWrapperServerProps>> {
    const { req } = context;
    const geoLocation = await geoLookup(req);
    const country =
        (getCookie("country", { req }) as string) || geoLocation.alpha2 || "US";
    const language =
        (getCookie("language", { req }) as string) ||
        geoLocation.language ||
        "en";
    const local = `${language.toLowerCase()}-${country.toUpperCase()}`;

    let translations: Record<string, string> = {};
    let basicTranslations: Record<string, string> = {};

    try {
        const response = await translationsSvc.getDirect({
            country,
            language
        });
        translations = Object.entries(response).reduce(
            (acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
            },
            {} as Record<string, string>
        );
        serverStore.setTranslation(local, translations);
    } catch (e) {
        console.log(e);
    }

    try {
        const response = await translationsSvc.getDirect({
            country: "US",
            language: "en"
        });
        basicTranslations = Object.entries(response).reduce(
            (acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
            },
            {} as Record<string, string>
        );
        serverStore.setTranslation("en-US", basicTranslations);
    } catch (e) {
        console.log(e);
    }

    return {
        props: {
            basicTranslations,
            translations
        }
    };
}
