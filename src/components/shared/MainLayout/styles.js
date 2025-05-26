import { css } from "@emotion/react";
import theme from "Styles/theme";

export default ({ display, fullWidth, height, margin }) => css`
    max-width: ${fullWidth ? "100%" : theme.desktopWidth}px;
    margin: ${margin};
    min-height: ${height};
    display: ${display};
`;
