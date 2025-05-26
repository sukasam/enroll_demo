import { css } from "@emotion/react";

export default css`
    padding: 0px !important;
    .row {
        width: 100% !important;
        display: flex;
        margin-bottom: 1rem;
        gap: 30px;
        padding-bottom: 5px;
    }
    .row .formField {
        width: 100%;
    }

    .MuiInputAdornment-root,
    .MuiSelect-select,
    .MuiSvgIcon-root {
        z-index: 1;
    }
    .title {
        font-family: "Inter";
        font-size: 18px;
        font-weight: 600;
        color: #153862;
        padding: 20px 0;
    }
    .field-container-25 {
        flex: 1 1 25%;
    }
    .field-container-50 {
        flex: 1 1 51%;
    }
    .billing-address-same-as-shipping {
        margin-left: 10px;
    }
    .checkbox-container {
        padding: 10px;

        @media (min-width: 600px) {
            background-color: #e8f3ff;
            border: 1px solid #9bbbdd;
            border-top: none;
            border-radius: 4px;
        }
    }
    .checkbox-container-active {
        padding: 20px;
        background-color: #fff;
    }
    .country-dropdown,
    .state-dropdown {
        margin-top: 5px;
    }
`;
