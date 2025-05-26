import { css } from "@emotion/react";

export default css`
    position: fixed; 
    right: 0px; 
    bottom: 5px; 
    z-index: 1000; 
    transform: scale(0.85);
    
    @media screen and (max-width: 600px) {
        .g-recaptcha {
            right: 5px;
            bottom: 5px;
        }
    .recaptcha-error {
        color: #b52e24;
        margin-left: 15px;
        font-size: 14px;
        font-weight: bold;
        margin-top: 3px;
    }
`;
