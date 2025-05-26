import { css } from "@emotion/react";

export default css`
    padding: 50px 0;
    font-family: "Inter", Arial, Helvetica, sans-serif;
    color: #0b3b61;

    .mobile-hidden {
        @media (max-width: 900px) {
            display: none;
        }
    }
    .order_instructions_container {
        padding: 15px 0;
    }
    .bankwire_container {
        margin-top: 15px;
    }
    .tile {
        background: #fff;
        border-radius: 12px;
        padding: 30px;
        padding-top: 50px;
        margin-top: 20px;

        &:first-of-type {
            margin-top: 0;
        }

        hr {
            border: none;
            height: 1px;
            width: 100%;
            background: #003764;
            opacity: 0.1;
            margin: 24px 0;
        }

        &.feel-great {
            display: grid;

            @media (max-width: 900px) {
                display: none;
            }
        }

        &.main {
            .emoji {
                font-weight: 600;
                font-size: 32px;
                margin-bottom: 32px;
            }

            > .title {
                font-weight: 700;
                font-size: 32px;
                color: #0b3b61;
            }

            section {
                padding: 24px 0;
                border-bottom: 1px solid rgba(0, 55, 100, 0.1);

                .title {
                    font-weight: 600;
                    font-size: 16px;
                    color: #153862;
                    display: flex;
                    align-items: center;
                    cursor: pointer;

                    @media (max-width: 900px) {
                        font-size: 14px;
                    }

                    .plus-minus {
                        display: none;
                        margin-left: auto;

                        @media (max-width: 900px) {
                            display: block;
                        }
                    }

                    .amount {
                        font-weight: 500;
                        margin-left: 4px;
                        display: none;

                        @media (max-width: 900px) {
                            display: block;
                        }
                    }
                }

                &:last-child {
                    padding-bottom: 0;
                    border-bottom: none;
                }

                &.details {
                    .card {
                        margin: 32px auto 24px auto;
                        border: 1px dashed rgba(21, 56, 98, 0.4);
                        border-radius: 8px;
                        padding: 24px;
                        display: flex;
                        justify-content: center;

                        &.mobile-hidden {
                            @media (max-width: 900px) {
                                display: none;
                            }
                        }

                        @media (max-width: 900px) {
                            margin: 32px 0;
                        }

                        .container {
                            width: 100%;
                            max-width: 750px;
                            display: grid;
                            grid-template-columns: 1fr 1fr;
                            gap: 24px;

                            @media (max-width: 900px) {
                                grid-template-columns: 1fr;
                            }
                        }

                        .elements {
                            width: max-content;
                            display: grid;
                            row-gap: 18px;

                            .element {
                                display: grid;
                                row-gap: 1px;
                                height: max-content;

                                .label {
                                    font-weight: 400;
                                    font-size: 14px;
                                    color: rgba(0, 55, 100, 0.6);

                                    @media (max-width: 900px) {
                                        font-size: 12px;
                                    }
                                }

                                .value {
                                    font-weight: 400;
                                    font-size: 14px;
                                    color: #003764;
                                    word-break: break-word;

                                    @media (max-width: 900px) {
                                        font-size: 12px;
                                    }
                                }
                            }
                        }
                    }

                    .additional-info {
                        display: grid;
                        row-gap: 16px;

                        @media (max-width: 900px) {
                            padding-top: 20px;
                            margin-top: 10px;
                            border-top: 1px solid rgba(0, 55, 100, 0.1);
                        }

                        .info {
                            display: flex;
                            font-size: 14px;
                            color: #153862;

                            @media (max-width: 900px) {
                                flex-direction: column;
                            }

                            strong {
                                font-weight: 600;
                                margin-right: 4px;
                            }
                        }
                    }
                }

                &.summary {
                    &:not(.expanded) {
                        @media (max-width: 900px) {
                            border-bottom: 0;
                            padding-bottom: 0;
                        }
                    }
                    .product {
                        margin-top: 20px;
                        display: flex;

                        img {
                            width: 80px;
                            height: 80px;
                            border-radius: 8px;
                            object-fit: contain;

                            @media (max-width: 900px) {
                                width: 60px;
                            }
                        }

                        .info {
                            display: flex;
                            display: grid;
                            row-gap: 4px;
                            grid-auto-rows: max-content;
                            margin-left: 32px;
                            width: max-content;

                            .name {
                                font-weight: 600;
                                font-size: 18px;
                                color: #003764;
                            }

                            .description {
                                font-weight: 400;
                                font-size: 14px;
                                color: #003764;
                                line-height: 17px;
                                opacity: 0.6;
                            }
                        }

                        .options {
                            .option {
                                displat: flex;
                                opacity: 0.4;
                                font-size: 12px;
                                font-family: Poppins;
                                color: #153862;

                                .option-name {
                                    font-weight: 600;
                                    margin-right: 4px;
                                }
                            }
                        }

                        .price {
                            margin-left: auto;
                            font-weight: 400;
                            font-size: 14px;
                            color: #003764;
                        }
                    }

                    .details {
                        margin-top: 42px;
                        width: calc(50% - 15px);
                        margin-left: auto;
                        display: grid;
                        row-gap: 8px;

                        @media (max-width: 900px) {
                            width: 70%;
                        }

                        .detail {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;

                            .label {
                                font-weight: 400;
                                font-size: 14px;
                                color: #003764;

                                strong {
                                    font-weight: 600;
                                }
                            }

                            .value {
                                font-weight: 400;
                                font-size: 14px;
                                color: #003764;

                                strong {
                                    font-weight: 600;
                                }
                            }
                        }
                    }
                }

                &.shipping {
                    .container {
                        margin-top: 24px;
                        display: grid;
                        column-gap: 30px;
                        grid-template-columns: repeat(2, 1fr);

                        .address {
                            font-weight: 400;
                            font-size: 14px;
                            color: #153862;
                            line-height: 20px;
                        }

                        .method {
                            color: #003764;
                            font-style: normal;
                            font-weight: 400;
                            opacity: 0.6;
                        }
                    }
                }

                &.payment {
                    .container {
                        margin-top: 24px;
                        display: flex;
                        align-items: center;

                        .name {
                            font-weight: 400;
                            font-size: 14px;
                            color: #153862;
                            margin-left: 5px;

                            strong {
                                font-weight: 600;
                            }
                        }
                        .message {
                            display: flex;
                            align-items: center;
                            justify-content: flex-start;
                            width: 100%;
                            padding: 0px 20px;
                        }
                        .message p {
                            font-weight: 400;
                            font-size: 14px;
                            color: #153862;
                            line-height: 20px;
                        }
                        @media (min-width: 900px) {
                            .message p {
                                width: 40%;
                                padding: 0px 16px;
                            }
                        }
                    }
                }
            }
        }

        &.aside {
            &.office {
                padding-top: 30px;

                img {
                    width: 100%;
                    border-radius: 8px;
                }

                .title {
                    margin-top: 20px;
                    font-size: 24px;
                }

                .description {
                    font-weight: 400;
                    font-size: 14px;
                    color: #003764;
                    margin-top: 6px;
                }

                .button {
                    margin-top: 24px;
                }
            }

            &.contact {
                .info-container {
                    display: flex;
                    flex-direction: column;
                    padding: 12px 0px;

                    .info {
                        padding: 24px 0;
                        display: flex;
                        align-items: center;
                        border-bottom: 1px solid rgba(0, 55, 100, 0.1);

                        &:last-child {
                            border-bottom: none;
                            padding-bottom: 0;
                        }

                        .image-container {
                            width: 18px;
                            height: 18px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-right: 16px;
                        }
                    }
                }
            }

            .title {
                font-weight: 700;
                font-size: 32px;
                line-height: 32px;
            }
        }
    }

    .aside-wrapper {
        @media (max-width: 900px) {
            width: 100vw;
            max-width: initial;
        }

        .feel-great {
            display: none;

            @media (max-width: 900px) {
                display: grid;
            }
        }
    }

    .feel-great {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 60px;

        @media (max-width: 900px) {
            grid-template-columns: 1fr;
            gap: 16px;
        }

        .content {
            .title {
                font-weight: 700;
                font-size: 24px;
                margin-bottom: 8px;
            }

            .description {
                font-weight: 400;
                font-size: 14px;
                margin-bottom: 20px;
            }
        }

        .image {
            width: 100%;

            img {
                display: flex;
                width: 100%;
                border-radius: 8px;
                max-height: 200px;
                object-fit: cover;
            }
        }
    }
`;
