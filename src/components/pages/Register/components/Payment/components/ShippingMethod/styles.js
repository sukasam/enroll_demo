import { css } from "@emotion/react";

export default css`
    .title {
        margin-bottom: 20px !important;
    }

    .formTitle {
        font-size: 20px;
        text-align: left;
        font-weight: bold;
        margin: 0;
    }

    .options {
        display: grid;
        row-gap: 20px;

        .option {
            padding-bottom: 22px;
            border-bottom: 1px solid #0037641a;

            .top {
                display: flex;
                align-items: start;
                cursor: pointer;

                .radio {
                    flex-shrink: 0;
                }

                .texts {
                    margin-left: 14px;

                    .name {
                        color: #023764;
                        font-family: Inter, Arial, Sans-Serif;
                        font-size: 14px;
                        height: 24px;
                        display: flex;
                        align-items: center;
                    }

                    .description {
                        margin-top: 11px;
                        color: #003764;
                        font-family: Inter, Arial, Sans-Serif;
                        font-size: 14px;
                        opacity: 0.6;
                    }
                }
            }

            .bottom {
                padding-bottom: 18px;
            }
        }
    }
`;
