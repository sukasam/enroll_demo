import { css } from "@emotion/react";

export default css`
    padding: 0 20px;
    border: 1px solid rgba(153, 188, 223, 0.25);
    border-radius: 6px;

    &.checked {
        border: 2px solid #99bcdf;
    }

    &.error {
        border-color: #d03c3c;
        color: #d03c3c;

        .top .label {
            color: #d03c3c;
        }

        .MuiRadio-root {
            filter: hue-rotate(129deg) brightness(0.6) saturate(2.8);
        }
    }

    .top {
        height: 50px;
        cursor: pointer;

        .label {
            margin-left: 12px;
            height: 100%;
            font-weight: 600;
            font-size: 14px;
            color: #023764;
            font-family: Inter;
            min-width: max-content;

            &.noBoldLabel {
                font-weight: 400;
            }
        }

        .radio {
            min-width: max-content;
        }
    }

    .right {
        margin-left: auto;
    }

    .bottom {
        padding: 24px 0;
    }
`;

export const errorMessageStyles = css`
    color: #d03c3c;
    font-size: 12px;
    margin-top: -12px;
`;
