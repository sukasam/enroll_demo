import { css, SerializedStyles } from "@emotion/react";
import { Theme } from "@mui/material";

export default {
    container: css`
        background: #fff;
        border-radius: 12px;
        overflow: hidden;

        @media (max-width: 900px) {
            width: calc(100% + 16px);
        }
    `,
    header: (theme: Theme): SerializedStyles => css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: ${theme.spacing(2)};
        cursor: pointer;
        background: #fff;
        transition: background-color 0.2s ease;
        outline: none; /* Remove default focus outline */

        &:hover {
            background-color: ${theme.palette.action.hover};
        }

        &:focus-visible {
            box-shadow: 0 0 0 2px ${theme.palette.primary.main};
        }
    `,

    totalPrice: (theme: Theme): SerializedStyles => css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(2)};

        .text {
            font-weight: 700;
            font-size: 16px;
            color: #003764;
        }

        .price {
            font-weight: 700;
            font-size: 16px;
            color: #003764;
        }
        @media (min-width: 600px) {
            padding: ${theme.spacing(2.5)};
        }
    `,

    toggleButton: (theme: Theme): SerializedStyles => css`
        background: none;
        border: none;
        padding: ${theme.spacing(1)};
        cursor: pointer;
        color: #003764;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
            background-color: ${theme.palette.action.hover};
            border-radius: 50%;
        }

        svg {
            font-size: 24px;
        }
    `,

    content: (theme: Theme): SerializedStyles => css`
        padding: ${theme.spacing(2.5)} ${theme.spacing(2.5)} ${theme.spacing(2)};

        > .title {
            font-weight: 700;
            font-size: 24px;
            margin-bottom: 36px;
        }

        .spinner {
            margin: auto;
            text-align: center;
        }

        hr {
            border: none;
            height: 1px;
            width: 100%;
            background: #003764;
            opacity: 0.1;
            margin: 24px 0;
        }

        @media (min-width: 600px) {
            border-bottom: 1px solid ${theme.palette.divider};
        }
    `
};
