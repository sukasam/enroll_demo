import { css } from "@emotion/react";

export default css`
    color: #003764;
    display: grid;
    grid-auto-flow: row;
    row-gap: 30px;

    @media (min-width: 900px) {
        width: 980px;
        max-width: 980px;
    }

    .header {
        text-align: center;
        font-family: "Poppins", Arial, Helvetica, sans-serif;

        @media (max-width: 900px) {
            text-align: left;
        }

        .title {
            font-weight: 600;
            font-size: 32px;
            line-height: 48px;
            margin-bottom: 8px;
        }

        .subtitle {
            font-weight: 500;
            font-size: 16px;
            line-height: 24px;
        }
    }

    .image-wrapper {
        text-align: center;
        margin-bottom: 60px;

        img {
            max-width: 100%;
            width: auto;
            height: auto;
            object-fit: contain;

            @media (min-width: 900px) {
                max-width: 530px;
            }
        }
    }

    .label {
        font-family: "Poppins", Arial, Helvetica, sans-serif;
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
        max-width: 580px;
        width: 100%;
        margin: auto;
    }

    .picker {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4px 30px;
        max-width: 580px;
        width: 100%;
        margin: auto;

        .long {
            font-family: "Poppins", Arial, Helvetica, sans-serif;
            grid-column-start: 1;
            grid-column-end: 3;
            font-weight: 600;
            font-size: 12px;
            line-height: 18px;
            opacity: 0.4;
        }

        .option {
            .option-button {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 12px 20px;
                border: 2px solid;
                border-color: rgba(153, 188, 223, 0.25);
                border-radius: 6px;

                &.clickable {
                    cursor: pointer;
                }

                .image-wrapper {
                    width: 70px;
                    height: 70px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 12px;
                    position: relative;
                    border-radius: 50%;
                    padding: 0;
                    overflow: hidden;
                    margin: 0;

                    img {
                        width: 100% !important;
                        height: 100% !important;
                        border-radius: 50%;
                        object-fit: cover;
                        border: 2px solid #e6eef6;
                        background: white;
                        aspect-ratio: 1;
                    }
                }

                div {
                    font-weight: 400;
                    font-size: 12px;
                    line-height: 16px;
                    opacity: 0.6;
                    text-align: center;
                }
            }

            &.selected {
                .option-button {
                    font-weight: 600;
                    border-color: #99bcdf;

                    .image-wrapper img {
                        border: 3px solid #5a90c3;
                    }
                }
            }

            &.disabled {
                opacity: 0.5;
                pointer-events: none;
            }

            .info {
                font-weight: 400;
                font-size: 9px;
                line-height: 12px;
                margin-top: 8px;
                opacity: 0.5;
                text-align: center;
            }
        }
    }

    .buttons {
        max-width: 580px;
        width: 100%;
        margin: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .cancel {
            text-decoration: underline;
            font-weight: 500;
            font-size: 16px;
            line-height: 24px;
            cursor: pointer;
            font-family: "Poppins", Arial, Helvetica, sans-serif;

            @media (max-width: 600px) {
                display: none;
            }
        }

        @media (max-width: 600px) {
            .button-wrapper {
                width: 100%;

                button {
                    width: 100%;
                }
            }
        }
    }
`;
