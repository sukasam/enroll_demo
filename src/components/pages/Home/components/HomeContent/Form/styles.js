import { css } from "@emotion/react";

export default css`
    position: relative;
    font-family: Inter, Arial, Helvetica, sans-serif;
    color: #153862;
    border: none !important;

    .label {
        font-size: 14px;
        font-weight: 500;
        padding: 10px 10px;
        color: #153862;
    }
    .enroller-id-wrapper {
        justify-content: space-between;
        display: flex;
        align-items: center;
    }
    .id-text-box {
        margin-bottom: 20px;
    }

    .sponsor-id {
        width: 288px;
        display: block;
        margin-bottom: 20px;
    }

    .sponsor-checkbox {
        display: flex;
        align-items: center;
    }
    .sponsor-checkbox label {
        font-size: 13px;
        font-weight: 500;
        padding: 10px 10px;
        color: #91a2b5 !important;
    }

    label {
        font-size: 14px;
        font-weight: 500;
        padding: 10px 10px;
        color: #153862;
    }
`;
