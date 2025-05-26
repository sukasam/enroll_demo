import { css } from "@emotion/react";

export default css`
    padding: 10px;
    width: 100%;
    color: #153862;
    font-family: "Inter", Arial, Helvetica, sans-serif;
    .getting-started {
        width: 85%;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
    }
    .getting-started-details {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .details-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .item-container {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 15px;
    }

    .icon-container {
        width: auto;
    }

    .text-container {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .title {
        font-weight: bold;
        margin-bottom: 3px;
    }
    .description {
        font-size: 15px;
    }
    @media (min-width: 780px) {
        .icon-container {
            width: 23%;
        }
        .text-container {
            width: 77%;
        }
    }
`;
