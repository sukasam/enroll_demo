import { css } from "@emotion/react";

export default css`
    color: #153862;
    font-family: "Inter", Arial, Helvetica, sans-serif;

    .bolder {
        font-weight: 600;
        margin-top: 0;
        color: #153862;
    }
    .logo {
        margin-bottom: 10px;
        @media (max-width: 600px) {
            display: flex;
            align-items: center;
            height: 26px;
            margin: 0 auto 20px auto;
        }
    }
    .social-link {
        color: #153862;
        @media (max-width: 600px) {
            margin: none;
        }
    }
    .links {
        text-decoration: none;
        margin-bottom: 10px;
        color: #153862;
        display: flex;
        width: max-content;

        &:hover {
            color: #99bcdf;
            text-decoration: underline;
        }
    }
    .bottom {
        background: #0b3b61;
        color: #ffffff;
    }

    .top-wrapper {
        border-top: 5px solid #99bcdf;
        display: flex;
        width: 100%;
    }

    .top {
        display: flex;
        margin: auto;
        max-width: calc(1170px - 48px);
        width: 100%;
        padding: 60px 40px 40px;
        flex-direction: column;

        @media (min-width: 900px) {
            flex-direction: row;
        }

        .social,
        .section {
            flex: 1;
        }

        .social {
            display: flex;
            flex-direction: column;
            justify-content: center;
            max-width: 330px;
            margin: auto;
            width: 100%;

            @media (min-width: 900px) {
                margin-left: 0;
                margin-top: 0;
                justify-content: flex-start;
            }

            .social-links {
                width: 100%;
                display: flex;
                justify-content: space-between;
                max-width: 280px;
                margin: auto;
                margin-top: 20px;
                margin-bottom: 50px;

                @media (min-width: 900px) {
                    margin-left: 0px;
                    max-width: 200px;
                }
            }

            .logo {
                height: 26px;
                width: max-content;
                margin: auto;

                @media (min-width: 900px) {
                    margin-left: 0;
                }
            }
        }

        .sections {
            display: flex;
            flex-direction: column;
            flex: 1;

            @media (min-width: 560px) {
                flex-direction: row;
            }

            .section {
                margin-bottom: 24px;

                @media (min-width: 560px) {
                    width: 50%;
                }
            }
        }
    }

    .bottom-items {
        width: 100%;
        padding: 24px;
        margin: auto;
        display: flex;
        flex-direction: column;

        .policy-container {
            display: flex;
            height: 100%;
            align-items: center;
            font-size: 12px;
            margin-left: 80px;

            @media (max-width: 900px) {
                width: auto;
                margin-left: 0;
                display: flex;
                justify-content: center;
            }
        }

        .copyright {
            display: flex;
            height: 100%;
            align-items: center;
            font-size: 10px;
            margin: auto;
            width: max-content;
            max-width: 100%;
            text-align: center;
            margin-bottom: 10px;

            @media (min-width: 560px) {
                text-align: left;
                margin: 0;
                margin-right: auto;
            }

            @media (min-width: 900px) {
                font-size: 12px;
                margin: 0;
            }
        }

        .separator {
            margin: 0 10px;
        }

        @media (min-width: 900px) {
            text-align: left;
            flex-direction: row;
            width: calc(1130px + 48px);
        }

        @media (min-width: 560px) {
            text-align: left;
            flex-direction: row;
        }
    }
    .policy {
        color: #ffffff;
        text-decoration: underline;
        &:hover {
            cursor: pointer;

            color: #99bcdf;
        }
    }
    .tou {
        color: #ffffff;

        text-decoration: underline;
        &:hover {
            cursor: pointer;
            color: #99bcdf;
        }
    }
`;
