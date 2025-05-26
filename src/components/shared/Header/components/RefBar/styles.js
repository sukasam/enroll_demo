import { css } from "@emotion/react";

export default css`
    display: flex;
    flex-wrap: wrap;
    padding: 12px;
    width: 100%;
    background: #0a3b61;
    position: relative;

    .input-wrapper {
        position: relative;
    }

    button {
        opacity: 0.6;
        transition: 0.3s;

        &:hover,
        &:active,
        &:focus,
        &:target {
            opacity: 1;
        }

        img {
            width: 16px !important;
        }
    }

    form {
        display: flex;
        justify-content: center;
    }

    .ref-bar-main {
        margin: 0 auto;

        .ref-success {
            width: 100%;
            color: white;
            display: inline-flex;
            align-items: center;
            display: flex;

            > * {
                margin-left: 0.25em;
            }

            .info-icon {
                margin-left: 10px;
            }
        }
    }
    .ref-error {
        font-size: 14px;
        color: #fd5c5c;
        margin-top: 8px;
        font-weight: 500;
        font-size: 12px;
        font-family: Inter;
        display: flex;
        width: calc(100% - 40px);
        justify-content: flex-start;

        @media (min-width: 580px) {
            justify-content: center;
        }
    }
    .arrow-button {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
    }
    .ref-input {
        font-family: Inter;
        background: #183962;
        width: 287px;
        height: 36px;
        display: flex;
        align-items: center;
        padding: 16px;
        border: solid 1px white;
        border-radius: 6px;
        opacity: 0.6;
        transition: 0.3s;
        padding-right: 40px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 13px;

        &.error {
            border-color: #fd5c5c;
            color: #fd5c5c;
        }

        &:focus {
            opacity: 1;
        }
    }
    input {
        color: white;
    }
    input::placeholder {
        color: white;
    }
    .tooltip-arrow {
        background: transparent;
        border-bottom-color: @white;
        border-width: 0 10px 5px;
        margin-left: -10px;

        @media (max-width: @screen-sm-min) {
            top: 0px;
            left: 93.5%;
        }
    }

    .tooltip-inner {
        padding: 25px;
        width: 330px;
        max-width: 330px;

        background: @white;

        p {
            color: @darkBlue;
            text-align: left;
            margin-bottom: 0;
            font-size: 14px;
            line-height: 1.3em;
        }
    }

    .tooltip-button {
        position: relative;
        top: 3px;
        text-decoration: none;
    }
    .banner-wrapper__figure {
        position: relative;
        flex: 2 1 20rem;

        @media screen and (max-width: 767px) {
            margin-left: -2rem;
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 1;
            position: relative;
        }
    }

    .banner-wrapper__content {
        margin: 5rem 0;
        padding-right: 2rem;
        flex: 1 1 20rem;
        position: relative;

        p {
            margin-bottom: 1.6rem;
        }
    }

    .banner-wrapper__content--dots {
        position: absolute;
        top: -100px;
        right: -50px;
        z-index: 0;
    }

    .banner-wrapper__content--dots--bottom {
        top: 75px;
    }

    .info-icon {
        margin-left: 24px;
        cursor: pointer;
    }
`;
