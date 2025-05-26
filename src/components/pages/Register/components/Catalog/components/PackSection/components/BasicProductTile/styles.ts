import { css, SerializedStyles } from "@emotion/react";
import { Theme } from "@mui/material";

export default {
    container: (theme: Theme): SerializedStyles => css`
        margin: 0 auto;
        border-radius: 12px;
        background: #f9f9f9;
        padding: ${theme.spacing(1.25)};
    `,

    basicInfo: (theme: Theme): SerializedStyles => css`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0 ${theme.spacing(1.25)};
    `,

    title: (theme: Theme): SerializedStyles => css`
        width: 100%;
        text-align: left;
        margin: ${theme.spacing(0.5)} 0;
        font-family: "Poppins", Arial, Helvetica, sans-serif;
        font-weight: 600;
        font-size: 22px;
        color: #003764;
        padding-top: ${theme.spacing(1.25)};
    `,

    priceAndLabel: (theme: Theme): SerializedStyles => css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(0.5)};
    `,

    value: (theme: Theme): SerializedStyles => css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing(0.25)} ${theme.spacing(0.5)};

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            flex-direction: row;
            align-items: center;
        }
    `,

    price: (theme: Theme): SerializedStyles => css`
        font-family: "Poppins", Arial, Helvetica, sans-serif;
        font-weight: 600;
        font-size: ${theme.typography.button.fontSize};
        color: #858585;

        @media (min-width: ${theme.breakpoints.values.md}px) {
            font-size: 18px;
        }
    `,

    label: (theme: Theme): SerializedStyles => css`
        font-family: "Poppins", Arial, Helvetica, sans-serif;
        font-weight: 300;
        font-size: ${theme.typography.button.fontSize};
        color: #858585;

        @media (min-width: ${theme.breakpoints.values.md}px) {
            font-size: 18px;
        }
    `,

    labelPaymentType: (theme: Theme): SerializedStyles => css`
        font-family: "Poppins", Arial, Helvetica, sans-serif;
        font-size: ${theme.typography.body1.fontSize};
        font-weight: 300;
        color: #858585;

        @media (min-width: ${theme.breakpoints.values.md}px) {
            font-size: ${theme.typography.body1.fontSize};
        }
    `,

    description: (theme: Theme): SerializedStyles => css`
        font-family: "Poppins", Arial, Helvetica, sans-serif;
        font-size: ${theme.typography.body1.fontSize};
        font-weight: 300;
        letter-spacing: 0px;
        text-align: left;
        color: #858585;
        padding: ${theme.spacing(1.25)} 0;
    `,

    basicButtonContainer: (theme: Theme): SerializedStyles => css`
        display: flex;
        justify-content: start;
        align-items: center;
        padding: 0 ${theme.spacing(1.25)} ${theme.spacing(1.25)}
            ${theme.spacing(1.25)};

        @media (min-width: ${theme.breakpoints.values.lg}px) {
            justify-content: end;
            padding: 0;
        }
    `,

    basicBtn: (theme: Theme): SerializedStyles => css`
        font-family: "Poppins", Arial, Helvetica, sans-serif;
        font-size: ${theme.typography.button.fontSize};
        font-weight: 300;
        letter-spacing: 0px;
        text-align: left;
        line-height: normal;
        color: #5084bb;
        text-decoration: underline;
        cursor: pointer;

        @media (min-width: ${theme.breakpoints.values.lg}px) {
            font-size: 18px !important;
            margin-right: 30px;
        }
    `
};
