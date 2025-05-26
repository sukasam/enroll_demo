import { css } from "@emotion/react";

export default css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5); // Changed to transparent white
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
`;
