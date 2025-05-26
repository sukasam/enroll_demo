import { css } from "@emotion/react";

export default {
    container: theme => css`
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 15px 0;
        padding: 0;
        @media (min-width: ${theme.breakpoints.values.sm}px) {
            padding: 0 15px;
        }
    `,

    feedbackContainer: css`
        background-color: #5a8fc3;
        border-radius: 4px;
        color: white;
        max-width: 500px;
        width: 100%;
        padding: 32px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
    `,

    ratingContainer: css`
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    `,

    ratingLabelsContainer: css`
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
    `,

    rating: css`
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
    `,

    title: css`
        color: white;
        text-align: center;
        font-weight: 500;
    `,

    outerTitle: css`
        color: #0b3b61
        text-align: center;
        font-weight: bold;
        margin-bottom: 16px;
    `,

    ratingLabel: css`
        color: white;
        font-size: 0.875rem;
        font-weight: 500;
        text-align: center;
    `
};
