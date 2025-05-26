import { css } from "@emotion/react";

export default css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    padding: 100px 0;
    overflow-y: auto;
    background-color: rgba(55, 67, 77, 0.26);
    cursor: pointer;
    z-index: 2;

    & > .modal {
        max-width: calc(100% - 50px);
        width: max-content;
        height: max-content;
        background-color: #fff;
        border-radius: 12px;
        padding: 30px;
        position: relative;
        cursor: default;

        & > .close {
            position: absolute;
            top: 12px;
            right: 12px;
            cursor: pointer;
            display: flex;
        }

        & > .title {
            font-family: Inter;
            font-weight: bold;
            font-size: 24px;
            margin-bottom: 32px;
            margin-top: 5px;
            color: #0b3b61;
        }
    }
`;

export const fullPageStyles = css`
    background: linear-gradient(180deg, #f6f9fc 0%, #f6f9fc 100.37%);
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    height: -webkit-fill-available;
    z-index: 10;
    display: flex;
    flex-direction: column;

    * {
        box-sizing: border-box;
    }

    header {
        height: 80px;
        display: flex;
        justify-content: space-between;
        padding: 48px 24px 16px;
        background: #ffffff;

        .close {
            cursor: pointer;
        }
    }

    footer {
        margin: 0 -24px -24px;
    }

    .wrapper {
        padding: 24px;
        overflow-y: auto;

        .container {
            padding: 36px 24px 30px;
            color: #0b3b61;
            background: #ffffff;
            border-radius: 12px;

            .title {
                font-weight: bold;
                font-size: 24px;
                margin-bottom: 32px;
            }
        }
    }
`;
