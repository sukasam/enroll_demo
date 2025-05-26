import { css } from "@emotion/react";

export default css`
    padding: 50px 0;
    font-family: "Inter", Arial, Helvetica, sans-serif;
    color: #0b3b61;

    .tile {
        background: #fff;
        border-radius: 12px;
        padding: 24px;
        padding-top: 20px;

        @media (min-width: 900px) {
            padding: 30px;
            padding-top: 50px;
        }

        &.main {
            .wrapper {
                max-width: 460px;
                margin: auto;

                > p {
                    color: #153862;
                }
            }
            .title {
                font-weight: 700;
                margin-bottom: 20px;
                font-size: 24px;

                @media (min-width: 900px) {
                    width: calc(100% + 16px);
                    font-size: 32px;
                }
            }

            .subtitle {
                font-weight: 600;
                margin-bottom: 20px;
                font-size: 16px;

                @media (min-width: 900px) {
                    font-size: 24px;
                }
            }

            > p {
                font-weight: 400;
                color: #153862;
                font-size: 16px;
                line-height: 22px;
                margin: 0;

                @media (min-width: 900px) {
                    font-size: 14px;
                }
            }

            form {
                margin-top: 24px;
                display: grid;
                grid-auto-flow: row;
                row-gap: 16px;

                > label {
                    color: rgba(0, 55, 100, 0.5);
                    font-weight: 500;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    cursor: pointer;

                    .MuiCheckbox-root {
                        margin-right: 12px;
                    }
                }

                button {
                    margin-top: 4px;
                }
            }

            .enrollment-link,
            .forgot-password {
                font-size: 13px;
                font-weight: 500;
                color: rgba(0, 55, 100, 0.5);
                display: flex;
                flex-direction: row;
            }
            .forgot-password:hover,
            .enrollment-link:hover {
                cursor: pointer;
                text-decoration: underline;
            }
            .forgot-password a,
            .enroll-link {
                color: rgba(0, 55, 100, 0.8);
                text-decoration: underline;
                margin: 0 2px;
                font-weight: 600;
            }
            .linksContainer {
                margin-top: 20px;
            }
        }

        #signin_button {
            margin: 20px 0px;
        }

        &.aside {
            @media (max-width: 900px) {
                width: calc(100% + 16px);
                margin-left: 8px;
            }

            .banner {
                margin-top: -50px;
                margin-left: -30px;
                height: 310px;
                width: calc(100% + 60px);
                background: url(/img/landing-banner.jpg);
                background-size: cover;
                background-position: center;
                border-radius: 12px 12px 0 0;
                position: relative;
                overflow: hidden;
                margin-bottom: 32px;

                @media (min-resolution: 150dpi) {
                    background-image: url(/img/landing-bannerx1_5.jpg);
                }

                @media (max-width: 900px) {
                    height: 465px;
                    border-radius: 0;
                }

                .overlay {
                    position: absolute;
                    display: flex;
                    height: 100%;
                    width: 100%;
                    background: linear-gradient(
                        90deg,
                        #efede8 30%,
                        rgba(239, 237, 232, 0) 50%
                    );

                    @media (max-width: 900px) {
                        background: linear-gradient(
                            180deg,
                            #efede8 30%,
                            rgba(239, 237, 232, 0) 50%
                        );
                    }
                }

                .content {
                    padding: 32px;
                    position: relative;
                    height: 100%;
                    display: flex;
                    flex: 1;
                    flex-direction: column;

                    .title {
                        font-weight: 600;
                        font-size: 28px;
                    }

                    img {
                        height: 16px;
                        margin-top: auto;
                        width: min-content;
                    }
                }
            }

            > .title {
                font-weight: 600;
                font-size: 24px;
                margin-bottom: 28px;

                @media (min-width: 900px) {
                    font-size: 18px;
                }
            }

            p {
                padding: 0;
                margin: 0;
                margin-bottom: 32px;
                color: #003764;
                font-size: 14px;

                @media (min-width: 900px) {
                    font-size: 16px;
                }
            }

            ul {
                list-style-image: url("/svg/list-checkmark.svg");
                color: #003764;
                padding-left: 20px;

                li {
                    margin-bottom: 8px;
                }
            }

            a {
                color: #003764;
                text-decoration: underline;
                font-weight: 600;
                font-size: 14px;
                display: flex;
                align-items: center;
                width: max-content;

                img {
                    margin-left: 8px;
                }
            }
        }
    }

    .aside-wrapper {
        @media (max-width: 900px) {
            width: 100vw;
            max-width: initial;
            padding-left: 0;
        }
    }
`;
