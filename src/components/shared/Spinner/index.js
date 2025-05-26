/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

export default function Spinner({ height = "1em", dark = false }) {
    const spinnerStyles = css`
        animation: rotate 1s cubic-bezier(0.88, 0.09, 0.37, 0.65) infinite;
        height: ${height};
        width: ${height};

        @keyframes rotate {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
    `;

    return (
        <svg
            css={spinnerStyles}
            fill="none"
            height={height}
            viewBox="0 0 24 24"
            width={height}
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                cx="12"
                cy="12"
                r="10"
                stroke={dark ? "#99BCDF" : "white"}
                strokeOpacity="0.5"
                strokeWidth="3"
            />
            <path
                d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C16.1967 2 19.7896 4.58521 21.2731 8.25"
                stroke={dark ? "#99BCDF" : "white"}
                strokeLinecap="round"
                strokeWidth="3"
            />
        </svg>
    );
}
