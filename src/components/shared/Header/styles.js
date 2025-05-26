import { css } from "@emotion/react";

export default {
    headerContainer: theme => css`
        display: flex;
        flex-direction: row;
        background-color: ${theme.palette.background.default};
        width: 100%;
        align-items: center;

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: ${theme.spacing(1.85)};
        }
    `,

    topRow: theme => css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: ${theme.spacing(1.25)};
        width: 100%;

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            padding: 0;
            flex-grow: 1;
        }
    `,

    logoContainer: theme => css`
        flex-shrink: 0;
        margin-left: ${theme.spacing(1.25)};
        margin-bottom: ${theme.spacing(1.25)};

        img {
            width: 120px;
            height: auto;
        }

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            margin-left: 0;
            margin-auto: auto;
            margin-bottom: 0;
        }
    `,

    navContainer: theme => css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1.25)};
        justify-content: flex-start;

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            justify-content: flex-end;
        }
    `,

    userActions: theme => css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: ${theme.spacing(1.25)};
        gap: ${theme.spacing(1.25)};
        border-top: 1px solid ${theme.palette.divider};

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            width: auto;
            padding: 0;
            border: none;
            flex-direction: row;
        }
    `,

    logoutButton: theme => css`
        background: none;
        border: none;
        color: ${theme.palette.text.secondary};
        font-size: ${theme.typography.button.fontSize}px;
        text-decoration: underline;
        cursor: pointer;
        padding: 0;
    `,

    bannerContainer: css`
        width: 100%;
    `,

    headerLogo: css`
        width: 120px !important;
        height: 30px !important;
    `
};
