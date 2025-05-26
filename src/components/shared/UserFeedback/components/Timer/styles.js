import { css } from "@emotion/react";

export default css`
    &.timer {
        position: fixed;
        top: 16px;
        left: 16px;
        z-index: 1201;
        display: flex;
        align-items: center;
        gap: 8px;

        .timer-circle {
            position: relative;
            width: 40px;
            height: 40px;
        }

        .timer-number {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(255, 255, 255, 0.9);
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-weight: 700;
            color: #000;
        }

        .timer-text {
            font-size: 0.75rem;
            color: black;
            background-color: rgba(255, 255, 255, 0.9);
            padding: 2px 8px;
            border-radius: 4px;
        }
    }
`;
