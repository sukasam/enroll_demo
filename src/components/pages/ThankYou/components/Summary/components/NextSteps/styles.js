import { css } from "@emotion/react";

export default css`
    padding-top: 20px;
    padding-bottom: 10px;
    font-family: "Inter", Arial, Helvetica, sans-serif;
    .container {
        display: flex;
        align-items: center;
        gap: 0 10px;
        flex-wrap: wrap;
    }
    .title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 700;
        font-size: 20px;
        color: #f36e1b;
    }
    .description {
        font-size: 16px;
        margin-left: 34px;
    }
    .number {
        background: #5a8fc3;
        color: #fff;
        padding: 2px 8px;
        border-radius: 8px;
        font-weight: bold;
        font-size: 15px;
    }

    .button {
        margin-left: 30px;
        margin-top: 20px;
    }
`;
