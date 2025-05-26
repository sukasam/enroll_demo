import { css } from "@emotion/react";

export default css`
    position: relative;
    display: flex;
    justify-content: center;

    .paypal-buttons {
        position: absolute !important;
        top: 0;
    }

    iframe {
        z-index: 0 !important;
    }

    button {
        width: 100%;
    }

    .paypal-loader {
        max-width: 750px;
    }
    .fade-in {
        opacity: 0;
        animation-name: fade-in;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
    }

    @keyframes fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
