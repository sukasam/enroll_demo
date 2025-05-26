import { getDefaultLanguage } from "Constants/countryConfig";
import { Alpha2 } from "Constants/countryConfig/enums";
import { getCookie } from "cookies-next";
import Document, {
    DocumentContext,
    DocumentInitialProps,
    Head,
    Html,
    Main,
    NextScript
} from "next/document";

function OpenGraphTags(): JSX.Element {
    return (
        <>
            <meta content="website" property="og:type" />
            <meta content="/og-image.png" property="og:image" />
        </>
    );
}

function FaviconTags(): JSX.Element {
    return (
        <>
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href="/favicon-32x32.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="16x16"
                href="/favicon-16x16.png"
            />
            <link
                rel="icon"
                type="image/svg+xml"
                href="/safari-pinned-tab.svg"
                color="#5bbad5"
            />
        </>
    );
}

function AppleTags(): JSX.Element {
    return (
        <>
            <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="/apple-touch-icon.png"
            />
            <meta name="apple-mobile-web-app-title" content="Unicity Enroll" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta
                name="apple-mobile-web-app-status-bar-style"
                content="default"
            />
        </>
    );
}

function SafariTags(): JSX.Element {
    return (
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
    );
}

function MicrosoftTags(): JSX.Element {
    return (
        <>
            <meta name="msapplication-config" content="/browserconfig.xml" />
            <meta name="msapplication-TileColor" content="#da532c" />
        </>
    );
}

function ThemeTags(): JSX.Element {
    return <meta name="theme-color" content="#ffffff" />;
}

function CookieConsentScript({ language }: { language: string }): JSX.Element {
    const isProduction = process.env.NODE_ENV === "production";
    const cookieYesId = isProduction
        ? process.env.NEXT_PUBLIC_COOKIEYES
        : process.env.NEXT_PUBLIC_COOKIEYES_DEV;

    return (
        <>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        window.ckySettings = {
                            documentLang: "${language || "en"}"
                        };
                    `
                }}
            />
            {cookieYesId && (
                <script
                    id="cookieyes"
                    type="text/javascript"
                    defer
                    src={`https://cdn-cookieyes.com/client_data/${cookieYesId}/script.js`}
                />
            )}
        </>
    );
}

interface MyDocumentProps extends DocumentInitialProps {
    language: string;
}

export default class MyDocument extends Document<MyDocumentProps> {
    static async getInitialProps(
        ctx: DocumentContext
    ): Promise<MyDocumentProps> {
        const initialProps = await Document.getInitialProps(ctx);
        const country =
            (getCookie("country", { req: ctx.req }) as Alpha2) || "US";
        const language =
            getDefaultLanguage(country) ||
            getCookie("language", { req: ctx.req }) ||
            "en";

        return { ...initialProps, language };
    }

    render(): JSX.Element {
        return (
            <Html lang={this.props.language || "en"}>
                <Head>
                    <OpenGraphTags />
                    <FaviconTags />
                    <AppleTags />
                    <SafariTags />
                    <link rel="manifest" href="/site.webmanifest" />
                    <MicrosoftTags />
                    <ThemeTags />
                    <CookieConsentScript language={this.props.language} />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
