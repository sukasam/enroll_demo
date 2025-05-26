import { css, SerializedStyles } from "@emotion/react";
import { Theme } from "@mui/material/styles";
import spacing from "../foundation/spacing";

export const helpers = {
    visuallyHidden: css`
        position: absolute !important;
        height: 1px;
        width: 1px;
        overflow: hidden;
        clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
        clip: rect(1px, 1px, 1px, 1px);
        white-space: nowrap;
    `,

    hide: css`
        display: none !important;
    `,

    hideOnMobile: (theme: Theme): SerializedStyles => css`
        @media (max-width: ${theme.breakpoints.values.sm}px) {
            display: none !important;
        }
    `,

    hideOnDesktop: (theme: Theme): SerializedStyles => css`
        @media (min-width: ${theme.breakpoints.values.sm}px) {
            display: none !important;
        }
    `,

    margin: {
        top: (size: keyof typeof spacing): SerializedStyles => css`
            margin-top: ${spacing[size]};
        `,
        bottom: (size: keyof typeof spacing): SerializedStyles => css`
            margin-bottom: ${spacing[size]};
        `,
        vertical: (size: keyof typeof spacing): SerializedStyles => css`
            margin-top: ${spacing[size]};
            margin-bottom: ${spacing[size]};
        `
    },

    padding: {
        all: (size: keyof typeof spacing): SerializedStyles => css`
            padding: ${spacing[size]};
        `,
        horizontal: (size: keyof typeof spacing): SerializedStyles => css`
            padding-left: ${spacing[size]};
            padding-right: ${spacing[size]};
        `
    },

    fullWidth: css`
        width: 100%;
    `,

    fullHeight: css`
        height: 100%;
    `,

    flex: {
        row: css`
            display: flex;
            flex-direction: row;
        `,
        column: css`
            display: flex;
            flex-direction: column;
        `,
        center: css`
            display: flex;
            align-items: center;
            justify-content: center;
        `,
        wrap: css`
            flex-wrap: wrap;
        `
    },

    text: {
        center: css`
            text-align: center;
        `,
        left: css`
            text-align: left;
        `,
        right: css`
            text-align: right;
        `,
        ellipsis: css`
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        `
    },

    position: {
        relative: css`
            position: relative;
        `,
        absolute: css`
            position: absolute;
        `,
        fixed: css`
            position: fixed;
        `,
        sticky: css`
            position: sticky;
            top: 0;
        `
    },

    // Accessibility
    focusOutline: css`
        &:focus-visible {
            outline: 2px solid currentColor;
            outline-offset: 2px;
        }
    `,

    overlay: css`
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
    `
};

// Usage example:
// <div css={[helpers.flex.center, helpers.margin.top('lg')]}>
//   Centered content with top margin
// </div>

export default helpers;
