import { css } from "@emotion/react";

export default {
    agreementText: theme => css`
        font-family: ${theme.typography.fontFamily};
        font-size: 14px;
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.palette.secondary.light};
    `,

    agreementCheckbox: theme => css`
        font-family: ${theme.typography.fontFamily};
        font-size: ${theme.typography.body2.fontSize};
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.palette.secondary.light};
        margin-bottom: ${theme.spacing(1)};
        a {
            text-decoration: underline;
            color: ${theme.palette.secondary.light};
        }
        @media (min-width: ${theme.breakpoints.values.sm}px) {
            margin-bottom: ${theme.spacing(0.5)};
        }
    `,

    formField: theme => css`
        padding: ${theme.spacing(1.25)};
        margin-top: ${theme.spacing(2)};

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            margin-top: ${theme.spacing(0.5)};
            margin-left: ${theme.spacing(3.75)};
        }
    `,

    continueButton: theme => css`
        padding: ${theme.spacing(1.25)};
        font-size: ${theme.typography.h6.fontSize};
        color: ${theme.palette.common.white};
        font-weight: ${theme.typography.fontWeightBold};
        background-color: ${theme.palette.primary.main};
        border: none;
        border-radius: 30px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        width: 100%;
        margin-bottom: ${theme.spacing(1.25)};
        margin: ${theme.spacing(3.75)} 0;

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            max-width: 230px;
            margin-left: ${theme.spacing(4.5)};
        }

        &:disabled {
            background-color: ${theme.palette.action.disabledBackground};
            color: ${theme.palette.text.disabled};
            cursor: not-allowed;
            border: 1px solid ${theme.palette.divider};
            opacity: 0.5;
        }
    `,

    eSignatureField: theme => css`
        margin-bottom: ${theme.spacing(2.5)};
        width: 100%;
        label {
            white-space: normal !important;
            padding: 20px 10px !important;
        }
        @media (min-width: ${theme.breakpoints.values.sm}px) {
            width: 50%;
            padding-left: 10px;
            label {
                white-space: nowrap !important;
            }
        }
    `,

    taxFieldsContainer: theme => css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing(0)};
        width: 100%;

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            flex-direction: row;
            gap: ${theme.spacing(1.3)};
        }
    `,

    taxField: theme => css`
        width: 100%;

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            flex: 1;
            min-width: 0;
        }
    `,

    singleTaxField: theme => css`
        width: 100%;

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            width: 50%;
            flex: unset;
        }
    `,

    optionalFields: theme => css`
        display: flex;
        width: 100%;
        @media (min-width: ${theme.breakpoints.values.sm}px) {
            margin-left: ${theme.spacing(3.75)};
            padding-left: 10px;
            width: 95%;
        }
    `,

    singleField: theme => css`
        display: flex;
        width: 100%;
        @media (min-width: ${theme.breakpoints.values.sm}px) {
            margin-left: ${theme.spacing(3.75)};
            width: 95%;
        }
    `,

    error: theme => css`
        color: ${theme.palette.error.main};
        font-size: ${theme.typography.caption.fontSize};
        margin: 0;
    `,

    errorTerms: theme => css`
        color: ${theme.palette.error.main};
        font-size: 14px;
        margin: ${theme.spacing(1)} 0 ${theme.spacing(1)} ${theme.spacing(3.75)};

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            margin-top: ${theme.spacing(1)};
            margin-bottom: 0;
        }
    `
};
