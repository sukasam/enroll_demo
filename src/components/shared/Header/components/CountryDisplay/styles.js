import { css } from "@emotion/react";

export default {
    container: theme => css`
        display: flex;
        align-items: center;

        span {
            margin: 0;
            padding: 5px 10px;
        }

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            margin-left: auto;
        }
    `,

    flag: theme => css`
        margin-left: 20px;

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            margin-left: 0;
        }
    `,

    text: theme => css`
        display: none;

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            display: block;
            font-family: ${theme.typography.fontFamily};
            font-weight: 400;
            font-size: ${theme.typography.fontSize};
            color: ${theme.palette.text.secondary};
        }
    `
};
