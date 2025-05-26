import { css } from "@emotion/react";

export default css`
    h2.title {
        width: 100%;
        text-align: center;
        margin: 40px 0;
        font-family: "Poppins", Arial, Helvetica, sans-serif;
        font-weight: 600;
        font-size: 40px;
        color: #003764;
    }

    .products {
        display: grid;
        grid-auto-flow: row;
        row-gap: 24px;

        @media (max-width: 899px) {
            row-gap: 12px;
        }
    }
`;
