import { css } from "@emotion/react";

export default {
    container: css`
        .MuiFormControl-root {
            margin: 0;
        }
    `,

    select: theme => css`
        .MuiOutlinedInput-notchedOutline {
            display: none;
        }

        .MuiInputBase-root {
            font-family: ${theme.typography.fontFamily};
            font-weight: 400;
            font-size: ${theme.typography.fontSize};
            color: ${theme.palette.text.secondary};
            margin-top: ${theme.spacing(0.25)}; // 2px
            min-width: 50px;
            width: 50px;

            @media (min-width: ${theme.breakpoints.values.sm}px) {
                min-width: 120px;
                width: 120px;
            }
        }

        .MuiSelect-select {
            padding-right: 24px !important;
        }
    `
};
