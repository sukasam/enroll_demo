import { css } from "@emotion/react";

export default css`
    .option {
        padding: 12px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;

        /* Rectangle 5290 */
        box-sizing: border-box;
        background: #ffffff;
        border: 1px solid #5a8fc3;
        border-radius: 32px;
        margin-top: 12px;
        cursor: pointer;

        .icon {
            margin-left: 24px;
        }

        .name {
            display: flex;
            align-items: center;
            font-size: 14px;

            .text {
                margin-left: 12px;
            }
        }

        .action {
            font-size: 12px;

            > div {
                span {
                    text-decoration: underline;
                    margin-right: 24px;
                }
            }
        }
    }
`;
