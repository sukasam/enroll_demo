import { css, SerializedStyles } from "@emotion/react";
import { Theme } from "@mui/material";

export default {
    creditCardContainer: (theme: Theme): SerializedStyles => css`
        display: flex;
        flex-direction: column-reverse;
        gap: ${theme.spacing(2)};
        padding: 0;
        background-color: none;

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            background-color: #f5f5f5;
            border: 1px solid #9bbbdd;
            border-radius: 14.5px 14.5px 0 0;
            padding: ${theme.spacing(2)};
            flex-direction: row;
        }
    `,

    cardContainer: (theme: Theme): SerializedStyles => css`
        width: 100%;

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            width: 50%;
        }
    `,

    formContainer: (theme: Theme): SerializedStyles => css`
        width: 100%;

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            width: 50%;
        }
    `,

    creditCardNumber: (theme: Theme): SerializedStyles => css`
        padding: 0 ${theme.spacing(0.625)};
        width: 100%;

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            width: 100%;
        }
    `,

    row: (theme: Theme): SerializedStyles => css`
        display: flex;
        justify-content: space-between;
        margin-top: ${theme.spacing(0.625)};
        width: 100%;
    `,

    formField: (theme: Theme): SerializedStyles => css`
        margin: ${theme.spacing(2.5)} ${theme.spacing(0.625)};
        width: 48%;
    `,

    name: css`
        display: none;
    `,

    paymentMethodLogos: (theme: Theme): SerializedStyles => css`
        padding: ${theme.spacing(1.25)} 0;
    `,

    // Custom styles for the card. We need to override the default styles
    cardStyles: (theme: Theme): SerializedStyles => css`
        .rccs {
            width: 100%;
            .rccs__card {
                max-width: 290px;
                .rccs__number {
                    font-size: 16px;
                }
            }
        }

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            .rccs {
                width: 290px;
                .rccs__card {
                    width: 100%;
                    .rccs__number {
                        font-size: 20px;
                    }
                }
            }
        }
    `
};
