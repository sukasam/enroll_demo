import { css } from "@emotion/react";

export default css`
    position: fixed;
    width: 100vw;
    height: 100vh;
    padding-left: 24px;
    padding-right: 24px;
    padding-top: 104px;
    background: rgba(55, 67, 77, 0.26);
    z-index: 2;
    display: flex;
    justify-content: center;
    top: 0;
    left: 0;

    .popup {
        background: #ffffff;
        border-radius: 12px;
        width: 100%;
        padding: 82px 24px 70px 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 770px;
        height: max-content;

        @media (max-width: 900px) {
            padding: 74px 24px 106px 24px;
        }

        .top {
            display: grid;
            column-gap: 12px;
            grid-auto-flow: column;
            align-items: center;

            .loader {
                display: grid;
                row-gap: 6px;

                .outside-line,
                .inside-line {
                    width: 32px;
                    height: 3px;
                    background: #153862;
                    border-radius: 3px;

                    &.outside-line {
                        animation: outside-line-animation 600ms ease-in-out
                            infinite;
                    }

                    &.inside-line {
                        animation: inside-line-animation 600ms ease-in-out
                            infinite;
                    }
                }
            }

            .title {
                font-family: "Poppins", Arial, Helvetica, sans-serif;
                font-weight: 500;
                font-size: 22px;
                color: #153862;
            }
        }

        .description {
            margin-top: 26px;
            font-family: Inter, Arial, Sans-Serif;
            font-weight: 500;
            font-size: 14px;
            color: #153862;
            text-align: center;
        }
    }

    @keyframes outside-line-animation {
        0% {
            transform: translateX(0px);
        }
        25% {
            transform: translateX(4px);
        }
        50% {
            transform: translateX(0px);
        }
        75% {
            transform: translateX(-4px);
        }
        100% {
            transform: translateX(0px);
        }
    }

    @keyframes inside-line-animation {
        0% {
            transform: translateX(0px);
        }
        25% {
            transform: translateX(-12px);
        }
        50% {
            transform: translateX(0px);
        }
        75% {
            transform: translateX(4px);
        }
        100% {
            transform: translateX(0px);
        }
    }
`;
