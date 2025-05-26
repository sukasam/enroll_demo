/** @jsxImportSource @emotion/react */
import { Box, CircularProgress, Typography } from "@mui/material";
import { useTranslate } from "Components/shared/Translate";
import { useEffect, useState } from "react";
import styles from "./styles";

export interface TimerProps {
    duration?: number;
    onComplete: () => void;
}

function Timer({ duration = 60, onComplete }: TimerProps): JSX.Element {
    const [timeLeft, setTimeLeft] = useState(duration);
    const t = useTranslate();

    useEffect(() => {
        if (timeLeft <= 0) {
            onComplete();
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [timeLeft, onComplete]);

    return (
        <Box css={styles} className="timer" data-testid="timer">
            <Box className="timer-circle">
                <CircularProgress
                    variant="determinate"
                    value={(timeLeft / duration) * 100}
                    size={40}
                    sx={{ color: "primary.main" }}
                />
                <Typography className="timer-number">{timeLeft}</Typography>
            </Box>
            <Typography className="timer-text">
                {t("thank_you_feedback_overlay_timer")}
            </Typography>
        </Box>
    );
}

export default Timer;
