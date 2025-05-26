import { css } from "@emotion/react";
import theme from "Styles/theme";

export default css`
    .container {
        max-width: calc(${theme.desktopWidth}px + 48px);
        display: auto;
        width: 100%;
        margin: 0 auto;
        padding: 0 24px;
    }

    .banner {
        max-width: ${theme.desktopWidth}px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        background: #fef8e2; /* Yellow background */
        padding: 20px; /* Increased padding for better scaling */
        margin: 10px 0; /* Add some space around the banner */
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 12px;
    }

    .message {
        font-family: "Inter";
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 23px;
        color: #955100;
    }

    .children {
        margin-top: 10px;
    }
`;
