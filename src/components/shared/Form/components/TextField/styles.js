import { css } from "@emotion/react";

export default css`
    font-family: Inter, Arial, Helvetica, sans-serif;
    color: rgba(21, 56, 98, 0.7);
    border: none !important;

    .label,
    .error {
        font-size: 14px;
        margin: 0;
        font-weight: 500;
    }

    .label {
        padding: 10px 10px 5px 10px;
        white-space: nowrap;
        height: 24px;
        display: flex;
        align-items: center;

        @media (max-width: 500px) {
            white-space: normal;
            word-wrap: break-word;
            max-width: 100%;
            height: auto;
        }
    }

    .input,
    .select {
        padding: 15px;
        font-size: 16px;
        width: 100%;
        border-radius: 5px;
        border: 1px solid #99bcdf;
        box-sizing: border-box;
        margin-bottom: 10px;
        margin-top: 5px;
    }

    .input.invalid {
        border: 1px solid red;
    }

    .error {
        color: #ff0000;
        font-size: 13px;
        font-weight: 400;
        margin-top: -7px;
        width: 100%;
        min-height: 20px;
        visibility: hidden;
    }
    .error.active {
        visibility: visible;
    }

    .showPasswordButton {
        position: absolute;
        right: 0;
        top: 46%;
        transform: translateY(-50%);
    }

    .locked-icon {
        position: absolute;
        right: 0;
        top: 48%;
        transform: translateY(-50%);
        pointer-events: none;
    }
`;
