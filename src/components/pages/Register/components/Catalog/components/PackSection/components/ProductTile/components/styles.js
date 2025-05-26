import { css } from "@emotion/react";

export default css`
    .label,
    .long,
    .option-button div,
    .info {
        font-family: "Poppins", Arial, Helvetica, sans-serif;
    }

    .unimate-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: start;
        padding: 10px 0px;
        width: 50%;
    }

    .option-button {
        display: flex;
        flex-direction: column;
        width: 80px;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        padding: 0px;
        margin: 0px;
        border-radius: 8px;
        transition: all 0.2s ease-in-out;
    }

    .balance-container {
        display: flex;
        justify-content: start;
        flex-wrap: wrap;
        order: 1;
        width: 50%;
        padding: 10px 0px;
    }

    .image-wrapper {
        width: 70px;
        height: 70px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 8px;
        position: relative;

        .option-image {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid transparent;
            transition: border-color 0.2s ease-in-out;
        }
    }

    .image-wrapper img {
        padding: 0px;
    }

    .selected {
        .option-image {
            border: 4px solid rgb(90, 144, 195) !important;
        }
    }

    .productType-label {
        width: 100%;
        padding-bottom: 10px;
        display: flex;
    }
    .selected-option {
        margin-left: 5px;
    }
    .label-title {
        font-weight: 600;
    }

    .packs-container {
        display: flex;
        align-items: flex-start;
    }

    .price {
        margin-left: 20px;
    }
    .option.selected {
        opacity: 1;
    }

    .option {
        opacity: 0.5;
        transition: opacity 0.2s ease-in-out;

        &:hover {
            opacity: 0.8;
        }
    }

    @media (max-width: 640px) {
        .packs-container {
            flex-wrap: wrap;
        }
        .balance-container,
        .unimate-container {
            width: 100%;
            gap: 0 10px;
        }

        .productType-label {
            margin-left: 0px;
        }
        .option-button {
            width: 100%;
            max-width: 120px;
        }
        .unimate-container {
            gap: 0 10px;
        }

        .image-wrapper {
            width: 60px;
            height: 60px;
        }
    }
`;
