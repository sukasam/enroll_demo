import { useEffect } from "react";

declare global {
    interface Window {
        onloadCallback?: () => void;
    }
}

function ReCaptchaScript(): null {
    useEffect(() => {
        // Define the onloadCallback function
        window.onloadCallback = (): void => {
            // This function will be called when reCAPTCHA is loaded
            console.log("reCAPTCHA loaded successfully");
        };

        // Load the reCAPTCHA script
        const script = document.createElement("script");
        script.src =
            "https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit";
        script.async = true;
        script.defer = true;
        script.onerror = (): void => {
            console.error("Failed to load reCAPTCHA script");
        };
        document.head.appendChild(script);

        return () => {
            // Cleanup
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
            delete window.onloadCallback;
        };
    }, []);

    return null;
}

export default ReCaptchaScript;
