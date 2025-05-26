import { css } from "@emotion/react";

export default css`
    font-family: Inter, Arial, Helvetica, sans-serif;
    color: #153862;
    border: none !important;

    legend {
        display: none;
    }

    .MuiSelect-select {
        padding: 12px 14px;
    }

    .label {
        font-size: 14px;
        font-weight: 500;
        padding: 10px 10px;
        color: rgba(21, 56, 98, 0.7);
    }

    .flag-icon {
        margin-right: -7px;
        margin-top: -3px;
    }
    fieldset {
        border-color: #99bcdf;
        margin: -1px;
    }
    .locked-icon {
        pointer-events: none;
        margin-right: 7px;
    }
`;
