import { ForwardRefExoticComponent, RefAttributes } from "react";

interface ReCaptchaProps {
    siteKey?: string;
}

declare const ReCaptcha: ForwardRefExoticComponent<
    ReCaptchaProps & RefAttributes<any>
>;

export default ReCaptcha;
