/** @type {import('next').NextConfig} */

const contentSrc = [
    "'self'",
    "hydra.unicity.net",
    "hydraqa.unicity.net",
    "hydrastg.unicity.net",
    "i.icomoon.io",
    "dev.ufeelgreat.com",
    "api.ufeelgreat.com",
    "*.unicityqa.com",
    "*.unicity.com",
    "unicity.cloudflareaccess.com",
    "us-autocomplete-pro.api.smartystreets.com",
    "international-autocomplete.api.smartystreets.com",
    "*.braintreegateway.com",
    "*.braintree-api.com",
    "*.paypal.com",
    "*.paypalobjects.com",
    "jeeves.unicity.com",
    "jeeves.unicityqa.com",
    "*.lr-in.com",
    "*.cookiebot.com",
    "firestore.googleapis.com",
    "*.google-analytics.com",
    "*.browser-intake-us5-datadoghq.com",
    "*.googletagmanager.com",
    " *.analytics.google.com",
    "*.g.doubleclick.net",
    "*.google.com",
    "*.launchdarkly.com",
    "*.mixpanel.com",
    "*.cardinalcommerce.com",
    "cdn-cookieyes.com",
    "*.cookieyes.com"
].join(" ");

const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "cdn.unicity.com",
    "*.unicityqa.com",
    "i.icomoon.io",
    "use.typekit.net",
    "s3.amazonaws.com",
    "*.braintreegateway.com",
    "*.braintree-api.com",
    "*.paypal.com",
    "*.paypalobjects.com",
    "www.googletagmanager.com",
    "*.google-analytics.com",
    "*.lr-in.com",
    "*.cookiebot.com",
    "https://www.google.com/recaptcha/",
    "https://www.gstatic.com/recaptcha/",
    "*.googletagmanager.com",
    "*.cloudflareinsights.com",
    "*.mixpanel.com",
    "*.cardinalcommerce.com",
    "cdn-cookieyes.com",
    "*.cookieyes.com"
].join(" ");

const imgSrc = [
    "'self'",
    "data:",
    "api.ufeelgreat.com",
    "*.unicityqa.com",
    "unicitystatic.s3.amazonaws.com",
    "s3.amazonaws.com",
    "p.typekit.net",
    "cdn.unicity.com",
    "d27zzi0gwko92h.cloudfront.net",
    "*.google-analytics.com",
    "*.braintreegateway.com",
    "*.braintree-api.com",
    "*.paypal.com",
    "*.paypalobjects.com",
    "*.google.com",
    "www.google.co.th",
    "*.lr-in.com",
    "*.cookiebot.com",
    "*.googletagmanager.com",
    "purecatamphetamine.github.io",
    "*.mixpanel.com",
    "cdn-cookieyes.com",
    "*.cookieyes.com"
].join(" ");

const childSrc = [
    "'self'",
    "blob:",
    "data:",
    "*.braintreegateway.com",
    "*.braintree-api.com",
    "*.paypal.com",
    "*.paypalobjects.com",
    "*.lr-in.com",
    "*.cookiebot.com",
    "*.unicityqa.com",
    "*.google-analytics.com",
    "*.googletagmanager.com",
    "*.mixpanel.com",
    "cdn-cookieyes.com",
    "*.cookieyes.com"
].join(" ");

const frameSrc = ["'self'", "*"].join(" ");

const styleSrc = [
    "'self'",
    "'unsafe-inline'",
    "fonts.googleapis.com",
    "*.braintreegateway.com",
    "*.braintree-api.com",
    "*.paypal.com",
    "*.google-analytics.com",
    "*.paypalobjects.com",
    "*.googletagmanager.com"
].join(" ");

const fontSrc = [
    "'self'",
    "fonts.gstatic.com",
    "*.lr-in.com",
    "*.braintreegateway.com",
    "*.braintree-api.com",
    "*.paypal.com",
    "*.google-analytics.com",
    "*.paypalobjects.com",
    "*.googletagmanager.com"
].join(" ");

const ContentSecurityPolicy = `
    connect-src ${contentSrc};
    script-src ${scriptSrc};
    img-src ${imgSrc};
    child-src ${childSrc};
    frame-src ${frameSrc};
    style-src ${styleSrc};
    font-src ${fontSrc};
`;

const nextConfig = {
    optimizeFonts: false,
    assetPrefix: process.env.NEXT_PUBLIC_DEPLOY_URL,
    productionBrowserSourceMaps: true,
    distDir: "/build",
    eslint: {
        ignoreDuringBuilds: true
    },
    experimental: {
        forceSwcTransforms: true
    },
    images: {
        domains: [
            "'self'",
            "data:",
            "api.ufeelgreat.com",
            "*.unicityqa.com",
            "unicitystatic.s3.amazonaws.com",
            "s3.amazonaws.com",
            "p.typekit.net",
            "cdn.unicity.com",
            "d27zzi0gwko92h.cloudfront.net",
            "assets.braintreegateway.com",
            "*.google.com",
            "*.lr-in.com"
        ]
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: ContentSecurityPolicy.replace(
                            /\s{2,}/g,
                            " "
                        ).trim()
                    }
                ]
            },
            {
                source: "/site.webmanifest",
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "https://unicity.cloudflareaccess.com"
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, OPTIONS"
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "Content-Type, Authorization"
                    },
                    {
                        key: "Access-Control-Allow-Credentials",
                        value: "true"
                    }
                ]
            }
        ];
    },
    webpack(config) {
        config.optimization = {
            ...config.optimization,
            minimize: true
        };

        // Add SVG support
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"]
        });

        return config;
    }
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true"
});

module.exports = withBundleAnalyzer(nextConfig);
