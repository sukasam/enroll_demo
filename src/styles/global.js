import { css, Global } from "@emotion/react";

const globalStyles = (
    <Global
        styles={css`
            html {
                scroll-behavior: smooth;
            }

            * {
                box-sizing: border-box;
            }
            #__next {
                min-height: 100vh;
                display: flex;
                flex-direction: column;
            }

            body {
                line-height: 1.6;
                background-color: var(--primary-grey);
                font-family: "Inter", sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                -webkit-tap-highlight-color: transparent;
            }
            a {
                text-decoration: none;
            }
            #__next {
                display: flex;
                flex-direction: column;
                overflow-x: hidden;
                scroll-behavior: smooth;
            }
            .layout {
                flex: 1 0 auto;
            }
            .footer {
                flex-shrink: 0;
            }
            input:focus {
                outline: none;
            }
            h1,
            h2,
            h3,
            h4 {
                margin-bottom: 1.6rem;
                font-weight: bold;
            }

            h1 {
                font-size: 3.375em;
                line-height: 4.75rem;
            }
            h2 {
                font-size: 2.25em;
                line-height: 4rem;
                margin-bottom: 1rem;
            }
            h3 {
                font-size: 1.5em;
            }
            h4 {
                font-size: 1.125em;
            }

            p,
            ul {
                margin-bottom: 1.2rem;
            }

            b {
                font-weight: bold;
            }

            .img-btn {
                cursor: pointer;
            }

            .visually-hidden {
                position: absolute !important;
                height: 1px;
                width: 1px;
                overflow: hidden;
                clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
                clip: rect(1px, 1px, 1px, 1px);
                white-space: nowrap; /* added line */
            }
            .box-product-name {
                margin-bottom: 0;
                a {
                    font-size: 1.2rem;
                    line-height: 1.6rem;
                    font-weight: bold;
                    text-decoration: none;
                }
            }
            .box-product-prices .current-price {
                color: grey;
                margin-bottom: 0.5rem;
                display: inline-block;
            }
            .box-product-prices {
                display: flex;
                flex-direction: row-reverse;
                justify-content: flex-end;
            }

            .original-price {
                text-decoration: line-through;
                margin-right: 0.5rem;
            }

            .box-product-img {
                width: 100%;
            }

            .post-classic img {
                width: 100%;
                height: 300px;
            }
            .post-title {
                margin: 1rem 0 0.5rem 0;
            }
            .post-modern > a {
                display: block;
            }
            .post-body {
                position: relative;
            }
            .badge.badge-primary {
                position: absolute;
                top: -48px;
                background: var(--dotcms-purple-80);
                color: var(--dotcms-purple-20);
                padding: 0 0.5rem;
                font-size: 1rem;
                font-style: italic;
            }
            .post-modern .post-img {
                width: 100%;
                object-fit: cover;
            }
            .post-title a {
                text-decoration: none;
                margin: 1rem 0;
                font-size: 1.2rem;
            }
            .col-lg-9.text-center {
                width: 60%;
                z-index: 1;
            }
            .post-modern-time > b {
                margin-right: 0.5rem;
            }

            .card-title > a {
                font-size: 1.2rem;
                font-weight: bold;
                display: inline-block;
                margin-bottom: 1rem;
                text-decoration: none;
            }
            /* too specific to avoid changing the stater */
            #section-3 > div > div > div > h1.text-center {
                font-size: 2.4rem;
            }
            #section-4 > div > div > div > h2 {
                font-size: 1.8rem;
            }

            #label-accept {
                display: flex;
                flex-direction: row;
                margin-right: 10px;
            }
            .cky-btn-revisit-wrapper {
                display: none !important;
            }
        `}
    />
);

export default globalStyles;
