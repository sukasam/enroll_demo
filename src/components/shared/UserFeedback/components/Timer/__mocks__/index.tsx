import { useEffect } from "react";
import { TimerProps } from "..";

const Timer = jest.fn(({ onComplete }: TimerProps): JSX.Element => {
    useEffect(() => {
        const timer = setTimeout(onComplete, 0);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return <div data-testid="timer">Timer</div>;
});

export default Timer;
