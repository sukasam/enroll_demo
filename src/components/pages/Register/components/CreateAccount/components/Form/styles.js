import { css } from "@emotion/react";

export default css`
    font-family: "Inter", Arial, Helvetica, sans-serif;
    color: #153862;
    border: none!important;
    .alreadyMember {cursor: pointer;}

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
        color: #153862;
    }

    .formTitle {
        font-size: 20px;
        text-align: left;
        font-weight: bold;
    }

    .sms {
        align-items: start;
    }

    .sms svg {
    margin-top: -5px;
}
    .form {
        display: flex;
        flex-direction: column;
        margin: 0 auto;
        border-radius: 8px;
        background-color: white;
    }

    .formRow,
    .checkboxField {
        display: flex;
        gap: 30px;
        // align-items: center;
    }

    .formRow.firstRow {
        height: 99.5px;
        @media (max-width: 1199px) {
            height: 100%;
        }
    }

    .formRow {
        margin-bottom: 10px;
    }

    .checkboxField {
        flex-direction: row;
        padding-bottom: 10px;
        width: 100%;
        padding: 10px 0px;
        flex-wrap: wrap;
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
    .checkboxField {
      padding: 30px 0px;
    }
    .checkboxField label {
        
        margin-left: -16px;
    }
    .checkboxLabel .MuiTypography-body1 {
        font-size: 14px !important; 
        font-weight: 500;
        line-height: 21px;
        color: #708fa8;
        letter-spacing: 0px;
        font-family: Inter,Arial,Helvetica,sans-serif;
    }
    .customCheckbox {
        color: #5a8fc3!important;
    }

    .formField.checkboxField.fullWidth {
        gap: 0;
    }
    .button:hover {
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
        margin-left: -10px;
        margin-top: -10px;
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
        min-height: 20px;
        margin-top: -10px;
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
        width: 100%;
        font-weight: 400;
        margin-left: 0;
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
    .passwordField {
        input {
            padding: 15px 37px 15px 15px !important;
        }
    }
    @media (max-width: 600px) {
        .passwordLabel {
            padding-top: 30px;
        }
    }
    @media (max-width: 768px) {
        .formField.halfWidth {
            width: 100%;
        }

        #password,
        .passwordRequirements {
            width: 100%;
            margin-left: 0;
            // margin-top: 20px;
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
