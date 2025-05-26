import { css } from "@emotion/react";

export default css`
    &.rating-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .rating {
            .MuiRating-icon {
                font-size: 3rem;
                margin-right: 0;
            }
            .MuiRating-iconFilled {
                color: #ffd700;
            }
            .MuiRating-iconEmpty {
                color: white;
            }
            .MuiRating-iconHover {
                color: #ffd700;
            }
            .MuiRating-decimal {
                padding: 0;
            }
        }

        .rating-labels-container {
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-top: 8px;
        }

        .rating-label {
            color: white;
            font-size: 0.875rem;
            font-weight: 500;
            text-align: center;
        }
    }
`;
