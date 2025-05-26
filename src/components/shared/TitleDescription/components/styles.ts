import { css, SerializedStyles } from "@emotion/react";
import { Theme } from "@mui/material";

export default {
    catalogContainer: (theme: Theme): SerializedStyles => css`
        @media (min-width: ${theme.breakpoints.values.sm}px) {
            display: flex;
            margin-top: 8px;
            > div:first-of-type {
                margin-right: 10px;
            }
        }
    `
};
