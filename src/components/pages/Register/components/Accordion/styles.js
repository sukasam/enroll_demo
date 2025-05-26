import { css } from "@emotion/react";

export default {
    accordionContainer: theme => css`
        font-family: ${theme.typography.fontFamily};
        color: ${theme.palette.text.primary};
        background-color: #fff;
        padding: ${theme.spacing(2.5)};
        border-radius: 10px;
    `,

    accordionSection: theme => css`
        border-bottom: 1px solid ${theme.palette.divider};

        &:last-of-type {
            margin-bottom: 0;
            border-bottom: none;
        }
    `,

    accordionSummary: theme => css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: ${theme.spacing(2)};

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            padding: ${theme.spacing(3.5)};
            flex-direction: row;
            align-items: center;
        }
    `,

    header: theme => css`
        display: flex;
        align-items: center;
        width: 100%;

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            width: auto;
            margin-bottom: 0;
            margin-bottom: ${theme.spacing(1)};
        }
    `,

    sectionIndicator: theme => css`
        align-self: flex-start;
        margin-top: ${theme.spacing(0.5)};

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            align-self: center;
            margin-top: 0;
        }
    `,

    title: theme => css`
        font-family: ${theme.typography.h3.fontFamily};
        font-size: ${theme.typography.h3.fontSize};
        font-weight: ${theme.typography.h3.fontWeight};
        color: ${theme.palette.text.primary};
        margin: 0 0 0 ${theme.spacing(0.625)};
        padding: 0;

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            margin-left: ${theme.spacing(0.625)};
        }
    `,

    details: theme => css`
        display: none;
        padding: ${theme.spacing(1.25)};
        background-color: ${theme.palette.background.white};
    `,

    expandedDetails: theme => css`
        display: block;
        margin-top: -${theme.spacing(3.75)};
        padding: 0 ${theme.spacing(1.875)};
    `,

    number: theme => css`
        color: ${theme.palette.common.white};
        padding: ${theme.spacing(0.125, 1)};
        border-radius: 30px;
        font-weight: ${theme.typography.fontWeightBold};
        background-color: ${theme.palette.grey[300]};
    `,

    activeNumber: theme => css`
        background-color: ${theme.palette.primary.main};
    `,

    check: theme => css`
        color: ${theme.palette.common.white};
        padding: ${theme.spacing(0.25)};
        border-radius: 30px;
        background-color: ${theme.palette.primary.main};
    `,

    changeButton: theme => css`
        margin-top: ${theme.spacing(1)};
        color: ${theme.palette.text.primary};
        background-color: transparent;
        border: none;
        padding: ${theme.spacing(0.625, 1.25)};
        cursor: pointer;
        text-decoration: underline;
        margin-left: auto;
        align-self: flex-start;

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            margin-left: auto;
            margin-top: 0;
        }
    `,

    completedDescription: theme => css`
        display: block;
        margin-top: ${theme.spacing(0.5)};
        align-self: flex-start;

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            display: inline;
            margin-top: 0;
        }
    `
};
