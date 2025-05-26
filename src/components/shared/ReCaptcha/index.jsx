import reCaptchaKey from "Constants/reCaptcha";
import { forwardRef, useImperativeHandle, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const ReCaptcha = forwardRef(({ siteKey = reCaptchaKey }, ref) => {
    const recaptchaRef = useRef();

    const executeInvisibleReCaptcha = () => {
        if (recaptchaRef.current) {
            return recaptchaRef.current.executeAsync();
        }
        return null;
    };

    const resetReCaptcha = () => {
        if (recaptchaRef.current) {
            recaptchaRef.current.reset();
        }
    };

    useImperativeHandle(ref, () => ({
        execute: executeInvisibleReCaptcha,
        reset: resetReCaptcha
    }));

    const handleError = () => {
        setTimeout(() => {
            executeInvisibleReCaptcha();
        }, 20000);
    };

    return (
        <div>
            <ReCAPTCHA
                data-testid="recaptcha"
                ref={recaptchaRef}
                sitekey={siteKey}
                onErrored={handleError}
                onExpired={handleError}
                size="invisible"
            />
        </div>
    );
});

export default ReCaptcha;
