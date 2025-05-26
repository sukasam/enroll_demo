import { css, SerializedStyles } from "@emotion/react";
import { Theme } from "@mui/material/styles";
import typography from "../foundation/typography";

export const text = {
    h1: (theme: Theme): SerializedStyles => css`
        font-family: ${typography.fontFamily.primary};
        font-weight: ${typography.fontWeight.bold};
        font-size: 2rem;
        line-height: 1.2;

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            font-size: 2.5rem;
        }

        @media (min-width: ${theme.breakpoints.values.md}px) {
            font-size: 3rem;
        }
    `,

    h2: (theme: Theme): SerializedStyles => css`
        font-family: ${typography.fontFamily.primary};
        font-weight: ${typography.fontWeight.bold};
        font-size: 1.75rem;
        line-height: 1.3;

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            font-size: 2rem;
        }
    `,

    bodyLarge: css`
        font-family: ${typography.fontFamily.primary};
        font-size: ${typography.fontSize.large};
        line-height: 1.5;
    `,

    bodyRegular: css`
        font-family: ${typography.fontFamily.primary};
        font-size: ${typography.fontSize.medium};
        line-height: 1.6;
    `,

    truncate: css`
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    `

    /*
    lineClamp: (lines: number): string => css`
        display: -webkit-box;
        -webkit-line-clamp: ${lines};
        -webkit-box-orient: vertical;
        overflow: hidden;
    `
    */
};

export default text;
