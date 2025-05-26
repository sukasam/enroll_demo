import { css } from "@emotion/react";

export default css`
    background: rgba(55, 67, 77, 0.26);
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;

    .popup {
        background: #ffffff;
        border-radius: 12px;
        width: 496px;
        max-width: calc(100% - 24px);
        padding: 30px;
        display: flex;
        align-items: center;
        flex-direction: column;

        @media (max-width: 899px) {
            padding: 30px 24px;
        }

        .popup-title {
            margin-top: 16px;
            color: #5A8FC3;
            font-size: 22px;
            font-weight: 600;
            font-family: "Poppins", Arial, Helvetica, sans-serif;

            @media (max-width: 899px) {
                margin-top: 12px;
            }
        }

        .description {
            margin-top: 12px;
            color: #5A8FC3;
            font-size: 16px;
            font-family: "Poppins", Arial, Helvetica, sans-serif;
            text-align: center;

            @media (max-width: 899px) {
                margin-top: 10px;
            }
        }

        .button-container {
            margin-top: 24px;
            grid-auto-flow: revert;
            display: grid;
            gap: 16px;

            @media (max-width: 899px) {
                gap: 12px;
            }

            * {
                margin: auto;
            }

            .continue {
                padding-left: 70px;
                padding-right: 70px;
            }

            .cancel {
                text-decoration-line: underline;
                color: #5A8FC3
                font-weight: 500;
                font-size: 16px;
                font-family: "Poppins", Arial, Helvetica, sans-serif;
                cursor: pointer;
            }
        }
    }
`;
