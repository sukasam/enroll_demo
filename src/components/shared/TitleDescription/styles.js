import { css } from "@emotion/react";

export default css`
    font-size: 14px;
    padding-left: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .icon {
        margin-bottom: -3px;
    }

    .description {
        display: flex;
        align-items: center;

        .text {
            margin-left: 12px;
        }
    }
`;
