import { css } from "@emotion/react";

export default css`
    font-family: "Inter", Arial, Helvetica, sans-serif;

    .autocomplete {
        .MuiAutocomplete-popupIndicatorOpen {
            transform: rotate(0deg) !important;
        }

        .MuiAutocomplete-root {
            width: 100% !important;
        }

        .MuiAutocomplete-popper {
            top: 16px;
        }
    }

    .dropdown {
        background: #ffffff;
        border: 1px solid #f1f5f8;
        box-shadow: 0px 4px 18px rgba(0, 0, 0, 0.05);
        border-radius: 8px;
        overflow: hidden;
        z-index: 1000;

        .option {
            height: 50px;
            padding: 0 16px;
            display: flex;
            align-items: center;
            cursor: pointer;
            font-size: 12px;
            color: #153862;

            &:hover {
                background: rgba(153, 188, 223, 0.2);
            }

            &:not(:last-child) {
                border-bottom: 1px solid #f1f5f8;
            }
        }
    }

    hr {
        border: none;
        height: 1px;
        display: flex;
        width: 100%;
        background: #003764;
        opacity: 0.1;
        margin: 24px 0;
    }

    .addressSuggestion {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .more {
        padding-left: 10px;
        font-weight: bold;
        display: flex;
        align-items: center;
    }
    .addressSuggestion {
        width: 100%;
    }
`;
