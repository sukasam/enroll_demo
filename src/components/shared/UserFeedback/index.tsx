/** @jsxImportSource @emotion/react */
import { Box, Typography } from "@mui/material";
import { useTranslate } from "Components/shared/Translate";
import { useEffect, useState } from "react";
import Rating from "./components/Rating";
import Timer from "./components/Timer";
import styles from "./styles";

export interface UserFeedbackProps {
    value: number | null;
    onFeedbackChange: (
        event: React.SyntheticEvent,
        value: number | null
    ) => void;
    showTimer?: boolean;
    onTimerComplete: () => void;
    variant?: "modal" | "aside";
}

function UserFeedback({
    value,
    onFeedbackChange,
    showTimer = false,
    onTimerComplete,
    variant = "modal"
}: UserFeedbackProps): JSX.Element {
    const t = useTranslate();
    const [showSuccess, setShowSuccess] = useState(false);
    const [pendingFeedback, setPendingFeedback] = useState<{
        event: React.SyntheticEvent;
        value: number;
    } | null>(null);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (showSuccess && pendingFeedback) {
            timeoutId = setTimeout(() => {
                setShowSuccess(false);
                onFeedbackChange(pendingFeedback.event, pendingFeedback.value);
                setPendingFeedback(null);
            }, 1500);
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [showSuccess, pendingFeedback, onFeedbackChange]);

    const handleRatingChange = (
        event: React.SyntheticEvent,
        newValue: number | null
    ): void => {
        if (newValue && newValue > 0) {
            setShowSuccess(true);
            setPendingFeedback({ event, value: newValue });
        }
    };

    return (
        <Box css={styles.container} data-testid="feedback_container">
            {variant === "modal" && (
                <Typography variant="h5" css={styles.outerTitle}>
                    {t("thank_you_feedback_overlay_title")}
                </Typography>
            )}

            <Box css={styles.feedbackContainer}>
                {showTimer && <Timer onComplete={onTimerComplete} />}

                {showSuccess ? (
                    <Box className="success-message">
                        <Typography variant="h6" css={styles.title}>
                            {t("thank_you_feedback_overlay_success")}
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Typography variant="h6" css={styles.title}>
                            {t("thank_you_feedback_overlay_prompt")}
                        </Typography>
                        <Rating value={value} onRate={handleRatingChange} />
                    </>
                )}
            </Box>
        </Box>
    );
}

export default UserFeedback;
