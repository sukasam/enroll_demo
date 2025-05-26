import { css } from "@emotion/react";

export default css`
    .button {
        width: 100%;
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
