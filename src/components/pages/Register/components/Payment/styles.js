import { css } from "@emotion/react";

export default css`
    .paymentSection {
        position: relative;
        border-bottom: 1px solid #ccc;
        padding: 0 0 16px 0;
        margin-top: 32px;

        @media (min-width: 600px) {
            margin-top: 0;
        }
    }

    font-family: Inter, Arial, Helvetica, sans-serif;
    color: #153862;
    border: none !important;

    .label {
        padding: 5px 10px;
    }

    .formTitle {
        font-size: 20px;
        text-align: left;
        font-weight: bold;
    }

    .form {
        display: flex;
        flex-direction: column;
        margin: 0 auto;
        padding: 0 20px;
        border-radius: 8px;
        background-color: white;
        gap: 10px;
    }

    .formRow {
        margin-bottom: 10px;
    }

    .input.invalid {
        border: 1px solid red;
    }

    .button:hover {
        background: #4a75a0;
    }
    .button {
        padding: 10px;
        font-size: 18px;
        color: white;
        background-color: #5a8fc3;
        border: none;
        border-radius: 30px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        max-width: 300px;
    }

    .button.disabled {
        background-color: #cccccc;
        color: #666666;
        cursor: not-allowed;
        border: 1px solid #999999;
        opacity: 0.5;
    }

    .error {
        color: #ff0000;
        font-size: 13px;
        font-weight: 400;
        margin: 0;
        width: 100%;
        min-height: 20px;
        visibility: hidden;
    }
    .error.active {
        visibility: visible;
    }

    .terms-error {
        margin-top: -10px;
    }

    @media (max-width: 768px) {
        .formField.halfWidth {
            width: 100%;
        }

        .formRow {
            flex-direction: column;
        }
    }
`;
