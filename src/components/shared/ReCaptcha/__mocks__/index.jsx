import React from "react";

const MockReCaptcha = React.forwardRef((props, ref) => (
    <div data-testid="mock-recaptcha" ref={ref}>
        Mock ReCaptcha
    </div>
));

MockReCaptcha.displayName = "MockReCaptcha"; // Good practice for debugging

export default MockReCaptcha;
