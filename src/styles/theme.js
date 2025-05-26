/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { createTheme } from "@mui/material/styles";

const darkBlue = "#0B3B61";
const lightBlue = "#5A8FC4";

const theme = createTheme({
    darkBlue,
    lightBlue,
    desktopWidth: 1400,
    colors: {
        primary: darkBlue,
        secondary: lightBlue,
        secondaryHover: "#82aeda",
        secondaryActive: "#82aeda"
    },
    primaryColor: darkBlue,
    secondaryColor: lightBlue,
    primaryButton: css`
        min-width: min(300px, 100%);
        width: max-content;
        max-width: 100%;
        text-decoration: none;
        display: flex;
        align-items: center;
        background: ${lightBlue};
        text-align: center;
        border-radius: 34px;
        cursor: pointer;
        font-family: Poppins, sans-serif;
        margin: 0;
        font-size: 20px;
        text-transform: none;
        font-weight: 600;
        color: #ffffff;
        padding: 6px 20px;

        &:hover,
        &:active {
            background: #82aeda;
            color: #ffffff;
        }

        &.Mui-disabled {
            color: #ffffff;
            background: ${lightBlue};
            opacity: 0.3;
        }

        &.dark {
            background: #003764;
            &:hover {
                background: ${lightBlue};
            }
        }
    `,
    components: {
        MuiInputLabel: {
            defaultProps: {
                shrink: true
            }
        }
    }
});
export default theme;
