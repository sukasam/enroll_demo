import { css } from "@emotion/react";

export default css`
    background-size: cover;
    background-color: #efede8;
    background-image: url("/img/catalog-banner-mobile.png");
    background-repeat: no-repeat;
    background-position: 50% 100px;
    height: 560px;
    margin: 0 -24px;
    position: relative;

    @media (min-width: 900px) {
        margin: 0;
    }

    @media (min-width: 560px) {
        text-align: center;
    }

    @media (min-width: 900px) {
        background-image: url("/img/catalog-banner.jpg");
        background-position: center;
        text-align: left;
    }

    @media (min-width: 500px) and (max-width: 600px) {
        background-position: 50% 50px;
    }

    @media (min-width: 600px) and (max-width: 900px) {
        background-position: 50% 10%;
    }

    .overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1;
        left: 0;
        top: 0;
        background: linear-gradient(
            180deg,
            #efede8 40%,
            rgba(241, 239, 234, 0) 60%
        );

        @media (min-width: 900px) {
            background: linear-gradient(
                90deg,
                #efede8 40%,
                rgba(241, 239, 234, 0) 60%
            );
        }
    }

    .content {
        position: relative;
        z-index: 1;
    }

    .content-container {
        margin-top: 40px;
        margin-left: 32px;
        margin-right: 32px;
        font-family: Poppins, Arial, Sans-Serif;

        @media (min-width: 560px) {
            margin: auto;
            margin-top: 60px;
            align-items: center;
            display: flex;
            flex-direction: column;
        }

        @media (min-width: 900px) {
            margin-top: 120px;
            margin-left: 134px;
            display: block;
        }
    }

    .title1 {
        font-weight: 500;
        font-family: Poppins, Arial, Sans-Serif;
        color: #0b3b61;
        max-width: 700px;
        margin: 0;
        font-size: 33px;
        line-height: 40px;

        @media (min-width: 900px) {
            font-size: 60px;
            line-height: 90px;
        }
    }

    .description {
        font-family: Poppins, Arial, Sans-Serif;
        max-width: 500px;
        margin-top: 30px;
        margin-bottom: 40px;
        color: #0b3b61;
        font-weight: 400;
        font-size: 16px;
        line-height: 28px;

        @media (min-width: 560px) {
            display: block;
            font-size: 18px;
        }

        @media (min-width: 900px) {
            font-size: 20px;
        }
    }
`;
