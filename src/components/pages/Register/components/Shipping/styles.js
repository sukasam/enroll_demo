import { css } from "@emotion/react";

export default css`
    .continue-button {
        padding: 10px;
        font-size: 18px;
        color: white;
        font-weight: 600;
        background-color: #5a8fc3;
        border: none;
        border-radius: 30px;
        cursor: pointer;
        -webkit-transition: background-color 0.3s ease;
        transition: background-color 0.3s ease;
        max-width: 230px;
        width: 100%;
        margin-bottom: 10px;
    }

    .country-dropdown,
    .state-dropdown {
        margin-top: -7px;
    }
    .shippingAddress {
        margin-top: 5px;
    }
    .addressChoice {
        padding: 5px;
    }
    .addressChoice a {
        margin-left: 10px;
    }
    .shipping_description {
        margin-left: 32px;
    }
`;
