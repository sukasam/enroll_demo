import { css } from "@emotion/react";

export default {
    actionButton: theme => css`
        position: absolute;
        top: -38px;
        right: 0;

        padding: 1px 8px;

        /* Rectangle 5290 */
        box-sizing: border-box;
        background: ${theme.palette.common.white};
        border: 1px solid ${theme.palette.primary.main};
        border-radius: 30px;

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            margin-top: ${theme.spacing(3)};
        }
    `,
    changeButton: theme => css`
        text-decoration: none;
        background-color: ${theme.palette.common.white};
        color: ${theme.palette.text.primary};
        border: none;
        padding: ${theme.spacing(0.625, 1.25)};
        cursor: pointer;
    `
};
