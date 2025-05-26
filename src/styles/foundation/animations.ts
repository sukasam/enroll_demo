const animations = {
    duration: {
        short: "150ms",
        medium: "300ms",
        long: "500ms"
    },
    easing: {
        easeIn: "cubic-bezier(0.4, 0, 1, 1)",
        easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
        easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)"
    }
} as const;

export default animations;
