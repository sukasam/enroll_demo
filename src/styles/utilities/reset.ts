import { css } from "@emotion/react";

export const reset = css`
    /* Modern CSS Reset */
    *,
    *::before,
    *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    /* Improve text rendering */
    html {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        scroll-behavior: smooth;
    }

    body {
        line-height: 1.5;
        min-height: 100vh;
        text-rendering: optimizeSpeed;
    }

    /* Make images easier to work with */
    img,
    picture,
    video,
    canvas,
    svg {
        display: block;
        max-width: 100%;
    }

    /* Remove built-in form typography styles */
    input,
    button,
    textarea,
    select {
        font: inherit;
    }

    /* Avoid text overflows */
    p,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        overflow-wrap: break-word;
    }

    /* Create a root stacking context */
    #root,
    #__next {
        isolation: isolate;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }

    /* Remove list styles */
    ul[role="list"],
    ol[role="list"] {
        list-style: none;
    }

    /* Remove all animations and transitions for people that prefer not to see them */
    @media (prefers-reduced-motion: reduce) {
        html:focus-within {
            scroll-behavior: auto;
        }
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
    }
`;

export default reset;
