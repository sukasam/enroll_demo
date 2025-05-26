/** @jsxImportSource @emotion/react */
import { Box, Rating as MuiRating, Typography } from "@mui/material";
import { useTranslate } from "Components/shared/Translate";
import styles from "./styles";

interface RatingProps {
    value: number | null;
    onRate: (event: React.SyntheticEvent, value: number | null) => void;
}

function Rating({ value, onRate }: RatingProps): JSX.Element {
    const t = useTranslate();

    return (
        <Box
            css={styles}
            className="rating-container"
            data-testid="rating-container"
            aria-label="Rating feedback section"
        >
            <MuiRating
                className="rating"
                value={value}
                onChange={onRate}
                size="large"
                precision={1}
                aria-label="Rate your experience"
            />
            <Box className="rating-labels-container" aria-hidden="true">
                <Typography className="rating-label">
                    {t("thank_you_feedback_overlay_star_label_1")}
                </Typography>
                <Typography className="rating-label">
                    {t("thank_you_feedback_overlay_star_label_5")}
                </Typography>
            </Box>
        </Box>
    );
}

export default Rating;
