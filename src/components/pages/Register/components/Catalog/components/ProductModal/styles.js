import { css } from "@emotion/react";

export default css`
    color: #003764;
    display: grid;
    grid-auto-flow: row;
    row-gap: 30px;

    @media (min-width: 900px) {
        max-width: 980px;
    }

    > .info {
        text-align: center;
        font-family: "Poppins", Arial, Helvetica, sans-serif;

        @media (max-width: 900px) {
            text-align: left;
        }

        .title {
            font-weight: 600;
            font-size: 32px;
            line-height: 48px;

            @media (max-width: 900px) {
                margin-bottom: 0 !important;
            }
        }

        .price {
            font-weight: 500;
            font-size: 16px;
            line-height: 24px;
            margin-bottom: 40px;
        }

        .image {
            margin-bottom: 60px;

            img {
                max-width: 100%;

                @media (min-width: 900px) {
                    max-width: 530px;
                }
            }
        }

        .button-wrapper {
            display: flex;
            justify-content: center;
            margin-bottom: 50px;

            @media (max-width: 900px) {
                button {
                    width: 100%;
                }
            }
        }
    }

    .description,
    .products-included,
    .perks,
    .extras {
        font-family: "Inter", Arial, Helvetica, sans-serif;
        font-weight: 400;
        padding: 40px 24px;
        font-size: 16px;
        margin: 0 -24px;

        @media (min-width: 900px) {
            padding: 50px;
            margin: 0;
            border-radius: 12px;
        }

        p {
            color: #003764;
        }

        .title {
            font-weight: 700;
            font-size: 20px;
            line-height: 24px;
            margin-bottom: 30px;
        }

        .list {
            display: grid;
            grid-auto-flow: row;
            row-gap: 8px;

            .list-item,
            .icon,
            .benefit {
                display: flex;
                font-weight: 500;
                font-size: 14px;
                font-family: "Poppins", Arial, Helvetica, sans-serif;
            }

            .icon {
                margin-right: 16px;
                color: #6d9bcb;
            }
        }
    }

    .description {
        background: rgba(153, 188, 223, 0.1);

        @media (max-width: 600px) {
            background: linear-gradient(
                180deg,
                #f6f9fc 0%,
                rgba(246, 249, 252, 0) 102.55%
            );
        }

        .title {
            margin-bottom: 16px;
        }
    }

    .products-included {
        width: 100%;
        padding: 50px 0;
        margin: 0;

        .wrapper {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr;
            gap: 26px;
            padding: 0;

            @media (min-width: 900px) {
                grid-template-columns: 1fr 1fr;
            }

            .product {
                flex: 1;

                img {
                    width: 100%;
                    border-radius: 16px;
                }

                .product-title {
                    font-weight: 600;
                    font-size: 36px;
                    line-height: 54px;
                    margin: 40px 0 30px;
                    font-family: "Poppins", Arial, Helvetica, sans-serif;
                }

                .product-description {
                    font-weight: 400;
                    font-size: 16px;
                    line-height: 26px;

                    ul {
                        list-style-image: url(/svg/list-checkmark.svg);
                        font: inherit;
                        color: inherit;
                        padding-left: 21px;
                        margin-left: 2px;
                    }
                }
            }
        }
    }

    .perks {
        background: #fbf7f1;

        .perk-wrapper {
            display: grid;
            grid-auto-flow: row;
            gap: 30px;

            @media (min-width: 900px) {
                grid-auto-flow: column;
            }

            .perk {
                display: flex;
                align-items: center;

                .label {
                    max-width: 160px;
                    margin-left: 16px;
                    font-weight: 400;
                    font-size: 16px;
                }
            }
        }
    }

    .extras {
        background: rgba(109, 176, 116, 0.08);
        display: grid;
        grid-auto-flow: row;
        gap: 16px;

        .title {
            margin-bottom: 0;
        }

        .wrapper {
            display: grid;
            grid-auto-flow: column;
            column-gap: 16px;
            padding: 0;

            .info {
                margin-top: 12px;
            }
        }
    }

    .mobile-button-wrapper {
        display: flex;
        width: 100%;

        @media (min-width: 600px) {
            display: none;
        }

        button {
            width: 100%;
        }
    }

    .annotations {
        color: #0b3b61;
        font-weight: 400;
        font-size: 9px;
        opacity: 0.5;

        a {
            text-decoration: underline;
            color: #0b3b61;
        }

        .bigger {
            font-size: 12px;
        }
    }
`;
