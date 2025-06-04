import reCaptchaKey from "Constants/reCaptcha";
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from "react";
import ReCAPTCHA from "react-google-recaptcha";

const ReCaptcha = forwardRef(({ siteKey = reCaptchaKey }, ref) => {
    const recaptchaRef = useRef();
    const [isMounted, setIsMounted] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const executeInvisibleReCaptcha = async () => {
        try {
            if (recaptchaRef.current) {
                return await recaptchaRef.current.executeAsync();
            }
            return null;
        } catch (err) {
            console.error("reCAPTCHA execution failed:", err);
            setError(err);
            return null;
        }
    };

    const resetReCaptcha = () => {
        try {
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
                setError(null);
            }
        } catch (err) {
            console.error("reCAPTCHA reset failed:", err);
            setError(err);
        }
    };

    useImperativeHandle(ref, () => ({
        execute: executeInvisibleReCaptcha,
        reset: resetReCaptcha
    }));

    const handleError = err => {
        console.error("reCAPTCHA error:", err);
        setError(err);
        setTimeout(() => {
            executeInvisibleReCaptcha();
        }, 20000);
    };

    if (!isMounted) {
        return null;
    }

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
            {error && (
                <div className="recaptcha-error" data-testid="recaptcha-error">
                    {error.message || "reCAPTCHA error occurred"}
                </div>
            )}
        </div>
    );
});

export default ReCaptcha;
