import { css, SerializedStyles } from "@emotion/react";
import { Theme } from "@mui/material/styles";
import breakpoints from "Styles/foundation/breakpoints";
import spacing from "../foundation/spacing";

export const layout = {
    // Flex layouts
    flexCenter: css`
        display: flex;
        align-items: center;
        justify-content: center;
    `,

    flexColumn: css`
        display: flex;
        flex-direction: column;
    `,

    flexBetween: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
    `,

    // Grid layouts
    gridContainer: (theme: Theme): SerializedStyles => css`
        display: grid;
        grid-template-columns: repeat(4, 1fr); // Mobile base grid
        gap: ${spacing.md};

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            grid-template-columns: repeat(8, 1fr);
        }

        @media (min-width: ${theme.breakpoints.values.lg}px) {
            grid-template-columns: repeat(12, 1fr);
        }
    `,

    // Common layout patterns
    container: (theme: Theme): SerializedStyles => css`
        width: 100%;
        margin: 0 auto;
        padding: 0 ${spacing.md};
        max-width: ${breakpoints.xl};

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            padding: 0 ${spacing.lg};
        }
    `,

    section: (theme: Theme): SerializedStyles => css`
        padding: ${spacing.xl} 0;

        @media (min-width: ${theme.breakpoints.values.sm}px) {
            padding: ${spacing.xxl} 0;
        }
    `
};

export default layout;
