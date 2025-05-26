import { css } from "@emotion/react";

export default css`
    margin-top: -20px!important;
    font-family: "Inter", Arial, Helvetica, sans-serif;
    color: #153862;
    border: none!important;

    .formTitle,
    .label,
    .error,
    .passwordLabel,
    .passwordRequirements {
        font-size: 14px;
        margin: 0;
        font-weight: 500;
    }

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
        border-radius: 8px;
        background-color: white;
        gap: 10px;
    }

    .formRow,
    .checkboxField {
        display: flex;
        gap: 10px;
        align-items: center;
    }

    .formRow {
        margin-bottom: 10px;
    }

    

    .formField,
    .input,
    .select {
        flex: 1;
    }
    .phoneNumberRow {
       align-items: baseline;
    }
    .input,
    .select, {
        padding: 15px;
        font-size: 16px;
        width: 100%;
        border-radius: 5px;
        border: 1px solid #99BCDF;
        box-sizing: border-box;
        margin-bottom: 10px;
        margin-top: 5px;
    }

    .PhoneInputInput {
        border: none;
        font-size: 16px;
    }

    .input.invalid {
        border: 1px solid red;
    }

    .continue-button:hover {
        background: #4a75a0;
    }
    .continue-button {
        padding: 10px;
        font-size: 18px;
        color: white;
        font-weight: 600;
        background-color: #5a8fc3;
        border: none;
        border-radius: 30px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        max-width: 230px;
        width: 100%;
        margin-top: -20px;
    }

    .continue-button.disabled {
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
        min-height:20px;
        visibility:hidden;
    }
    .error.active {
        visibility: visible;
    }

    .terms-error{
        margin-top: -10px;
    }
    .passwordLabel {
        font-weight: 500;
        color: #063a66;
    }

    .passwordRequirements {
        font-size: 14px;
        width: 48%;
        font-weight: 400;
        margin-left: 10px;
    }

    .passwordRequirements ul {
        list-style: none;
        margin: 10px 0;
        padding-left: 15px;
    }

    .passwordRequirements li.initial {
        color: #6687a2;
    }

    .passwordRequirements li.valid {
        color: green;
    }

    .passwordRequirements li.invalid {
        color: red;
    }

    .passwordRequirements li.valid::before {
        content: "✓";
        color: green;
        margin-right: 5px;
    }

    .passwordRequirements li.initial::before {
        content: "•"; 
        color: #6687a2
        color: #333; 
        margin-right: 5px;
    }

    .passwordRequirements li.invalid::before  {
        content: "✗";
        color: red;
        margin-right: 5px;
    }
    .passwordContainer {
        display: flex;
    }

    @media (max-width: 600px) {
        .passwordLabel {
            padding-top: 30px;
        }
    }

    @media (max-width: 768px) {
        .continue-button {
            margin-top: 20px;
        }
        .formField.halfWidth {
            width: 100%;
        }

        #password,
        .passwordRequirements {
            width: 100%;
            margin-left: 0;
            margin-top: 20px;
        }

        .formRow {
            flex-direction: column;
            width: 100%;
            gap: 0;
            margin: 0;
        }

        .formField {
            width: 100%;
        }

        .form {
            gap: 0;
        }
    }
`;
