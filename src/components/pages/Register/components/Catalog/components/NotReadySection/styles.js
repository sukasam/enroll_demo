import { css } from "@emotion/react";

export default css`
    .wrapper {
        max-width: 776px;
        color: #003764;
        font-family: "Poppins", Arial, Helvetica, sans-serif;
        text-align: center;
        margin: 100px auto;

        h2 {
            font-weight: 600;
            font-size: 18px;
            line-height: 1.3em;
            margin-bottom: 24px;
            padding: 0;

            @media (min-width: 900px) {
                font-size: 16px;
            }
        }

        .button-wrapper {
            margin: auto;
            margin-top: 24px;
            width: max-content;
        }
    }
`;
