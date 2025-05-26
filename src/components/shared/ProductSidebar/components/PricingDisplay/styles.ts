import { css } from "@emotion/react";

export default css`
    .prices {
        margin-top: 32px;

        display: grid;
        row-gap: 16px;

        .price {
            display: flex;
            justify-content: space-between;

            .name {
                font-size: 14px;
                color: #003764;
            }

            .value {
                font-weight: 600;
                font-size: 14px;
                color: #003764;
            }
        }
    }
`;
