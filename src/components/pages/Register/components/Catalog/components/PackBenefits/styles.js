import { css } from "@emotion/react";

export default css`
    border-radius: 12px;
    padding: 10px;
    color: #003764;
    font-family: "Inter", Arial, Helvetica, sans-serif;
    position: relative;
    overflow: hidden;

    @media (min-width: 900px) {
        flex-wrap: nowrap;
    }

    &.basic {
        @media (max-width: 899px) {
            .top {
                flex-direction: column;
                align-items: flex-start;

                .title {
                    font-size: 24px !important;
                }

                .price {
                    .value {
                        text-align: left;
                    }

                    .label {
                        font-size: 14px !important;
                    }
                }
            }
        }

        .top {
            display: flex;
            justify-content: space-between;

            .title {
                color: #003764 !important;
            }
        }
    }

    .recommended {
        background: var(--accent);
        font-weight: 600;
        font-size: 17px;
        font-family: "Poppins", Arial, Helvetica, sans-serif;
        color: #fff;
        padding: 8px 80px;
        text-align: center;
        position: relative;
        top: -20px;
        left: 0;
        width: calc(100% + 80px);
        margin: 0 -20px;

        @media (min-width: 900px) {
            transform: translate(0, calc((var(--width) + 10px) / 2))
                rotate(45deg) translateY(-100px);
            position: absolute;
            right: 0;
            top: 0;
            left: initial;
            margin: 0;
            width: auto;
        }
    }

    .image-wrapper {
        display: flex;
        justify-content: center;
        img {
            width: 75%;
            padding: 20px 0px;
        }
    }

    .info {
        padding-left: 20px;

        @media (max-width: 900px) {
            padding-left: 0;
        }

        .top {
            .title {
                font-weight: 600;
                font-size: 32px;
                font-family: "Poppins", Arial, Helvetica, sans-serif;
                color: var(--accent);
                text-align: center;

                @media (min-width: 900px) {
                    text-align: left;
                }
            }

            .price {
                margin-bottom: 16px;

                @media (max-width: 900px) {
                    text-align: center;
                }

                .discount {
                    color: var(--accent);
                    display: inline-block;
                    font-size: 14px;
                    margin-left: 12px;
                }
            }
        }
    }

    .list {
        font-family: "Poppins", Arial, Helvetica, sans-serif;
        font-weight: 500;
        margin: 16px 0;

        .list-item {
            display: flex;
        }
        .icon {
            padding-top: 4px;
            color: #faa977;
            margin-right: 16px;
        }
    }

    .more {
        font-weight: 600;
        font-size: 16px;
        text-decoration: underline;
        cursor: pointer;
        padding: 20px 0;
    }

    button {
        @media (max-width: 900px) {
            width: 100% !important;
        }
    }

    .topMargin {
        margin-top: 16px;
    }

    .value {
        font-family: "Poppins", Arial, Helvetica, sans-serif;
        font-weight: 600;
        font-size: 24px;
        line-height: 24px;
        margin-bottom: 10px;
    }
    .title {
        font-weight: 600;
        font-size: 32px;
        font-family: "Poppins", Arial, Helvetica, sans-serif;
        margin: 0 0 10px 0;
    }

    .slide-link a {
        color: #003764;
        text-decoration: underline;
    }
    .slide-link a img {
        margin-left: 8px;
        vertical-align: middle;
    }
`;
