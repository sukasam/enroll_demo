import { css, SerializedStyles } from "@emotion/react";
import { Theme } from "@mui/material/styles";

export default {
    container: css`
        padding: 0;
    `,

    row: (theme: Theme): SerializedStyles => css`
        width: 100%;
        display: flex;
        margin-bottom: ${theme.spacing(1)};
        gap: ${theme.spacing(3.75)}; // 30px
        padding-bottom: ${theme.spacing(0.625)}; // 5px

        .formField {
            width: 100%;
        }

        @media (max-width: ${theme.breakpoints.values.sm}px) {
            flex-direction: column;
            gap: ${theme.spacing(0.625)}; // 5px
            margin-bottom: 0;
        }
    `,

    rowHalf: (theme: Theme): SerializedStyles => css`
        width: 100%;
        display: flex;
        margin-bottom: ${theme.spacing(1)};
        gap: ${theme.spacing(3.75)}; // 30px
        padding-bottom: ${theme.spacing(0.625)}; // 5px

        .formField {
            width: 50%;
            padding-right: 14px;
        }

        @media (max-width: ${theme.breakpoints.values.sm}px) {
            flex-direction: column;
            gap: ${theme.spacing(0.625)}; // 5px
            margin-bottom: 0;

            .formField {
                width: 100%;
                padding-right: 0;
            }
        }
    `,

    muiOverrides: css`
        .MuiInputAdornment-root,
        .MuiSelect-select,
        .MuiSvgIcon-root {
            z-index: 1;
        }
    `,

    title: (theme: Theme): SerializedStyles => css`
        font-family: ${theme.typography.fontFamily};
        font-size: ${theme.typography.pxToRem(18)};
        font-weight: 600;
        color: ${theme.palette.primary.dark};
        padding: ${theme.spacing(2.5, 0)}; // 20px 0
    `,

    fieldContainer: {
        quarter: css`
            flex: 1 1 25%;
        `,
        half: (theme: Theme): SerializedStyles => css`
            flex: 1 1 51%;

            @media (max-width: ${theme.breakpoints.values.sm}px) {
                width: 100%;
                margin-bottom: ${theme.spacing(2.5)}; // 20px
            }
        `
    },

    labelWithTooltip: (theme: Theme): SerializedStyles => css`
        .label {
            display: flex;
            align-items: center;
            gap: ${theme.spacing(1)};
            height: 24px;
        }

        @media (max-width: ${theme.breakpoints.values.sm}px) {
            .label {
                gap: ${theme.spacing(0.5)};
            }
        }
    `,

    stateDropdown: (theme: Theme): SerializedStyles => css`
        @media (max-width: ${theme.breakpoints.values.sm}px) {
            margin-top: ${theme.spacing(-2.5)}; // -20px
            margin-bottom: ${theme.spacing(1.25)}; // 10px
        }
    `,

    submitButtonContainer: (theme: Theme): SerializedStyles => css`
        margin: ${theme.spacing(2.5, 0)}; // 20px 0
    `,

    continueButton: css`
        font-size: 18px;
        color: white;
        font-weight: 600;
        background-color: #5a8fc3;
        border: none;
        border-radius: 30px;
        cursor: pointer;
        -webkit-transition: background-color 0.3s ease;
        transition: background-color 0.3s ease;
        max-width: 230px;
        width: 100%;
        justify-content: center;
        display: flex;
        min-height: 40px;
        align-items: center;
    `
};
