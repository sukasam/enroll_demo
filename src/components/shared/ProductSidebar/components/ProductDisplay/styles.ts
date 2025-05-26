import { css } from "@emotion/react";

export default css`
    .top-row {
        display: flex;
        justify-content: space-between;
        gap: 12px;
    }

    img {
        width: 70px;
        height: 70px;
        object-fit: contain;
        flex-shrink: 0;
        margin-right: 14px;
    }

    .info {
        display: flex;
        flex-direction: column;
        flex: 1;

        .title {
            font-family: "Inter", Arial, Helvetica, sans-serif;
            font-weight: 600;
            font-size: 18px;
            color: #003764;
        }

        .options {
            margin: 4px 0;

            .option {
                displat: flex;
                opacity: 0.4;
                font-size: 12px;
                color: #153862;

                .option-name {
                    font-weight: 600;
                    margin-right: 4px;
                }
            }
        }
    }

    .description {
        font-family: "Inter", Arial, Helvetica, sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #003764;
        opacity: 0.6;
        margin-top: 5px;
    }

    .change-button {
        background-color: #fff;
        color: #003764;
        border: none;
        cursor: pointer;
        text-decoration: underline;
        padding: 0px;
    }

    .product-prices {
        margin-left: 12px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        .price {
            font-family: "Inter", Arial, Helvetica, sans-serif;
            font-weight: 600;
            font-size: 14px;
            color: #023764;
        }

        .rrp {
            font-family: "Inter", Arial, Helvetica, sans-serif;
            font-weight: 400;
            font-size: 11px;
            color: #009ecf;
            text-decoration: line-through;
            display: none;
        }
    }
`;

// import { css } from '@emotion/react';

// const styles = {
//     productContainer: css`
//         display: grid;
//         grid-template-columns: 1fr 2fr;
//         grid-template-rows: auto 1fr;
//         gap: 16px;
//         align-items: start;

//         .top-row {
//             display: flex;
//             align-items: center;
//             grid-column: 1 / -1; // Span across all columns

//             .product-image {
//                 width: 70px;
//                 height: 70px;
//                 object-fit: contain;
//                 flex-shrink: 0;
//                 margin-right: 14px;
//                 grid-row: 1 / -1; // Span across all rows
//             }

//             .title {
//                 display: flex;
//                 justify-content: space-between;
//                 align-items: center;
//                 width: 100%;
//                 padding-left: 20px; // Space between image and text

//                 .name {
//                     font-family: "Inter", Arial, Helvetica, sans-serif;
//                     font-weight: 600;
//                     font-size: 18px;
//                     color: #003764;
//                 }

//                 .options {
//                     margin: 4px 0;

//                     .option {
//                         displat: flex;
//                         opacity: 0.4;
//                         font-size: 12px;
//                         font-family: Poppins;
//                         color: #153862;

//                         .option-name {
//                             font-weight: 600;
//                             margin-right: 4px;
//                         }
//                     }
//                 }

//             }
//         }

//         .description-row {
//             grid-column: 2 / -1; // Start from the second column
//             font-family: "Inter", Arial, Helvetica, sans-serif;
//             font-weight: 400;
//             font-size: 14px;
//             color: #003764;
//             opacity: 0.6;
//             margin-top: 5px;
//         }
//     `
// };

// export default styles;
