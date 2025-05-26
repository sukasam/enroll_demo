/** @jsxImportSource @emotion/react */
import { useMediaQuery, useTheme } from "@mui/material";
import { useCountryConfig } from "Constants/countryConfig";
import Image from "next/image";
import styles from "./styles";

function PaymentMethodLogos() {
    const countryConfig = useCountryConfig();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const logos = countryConfig?.paymentLogos;

    return (
        <div className="logo-container" css={styles}>
            {logos?.map(logo => (
                <Image
                    className="payment-logo"
                    key={`logo-${logo}`}
                    src={`/payment-methods/${logo}.svg`}
                    alt={`${logo} payment method`}
                    width={isMobile ? 40 : 64}
                    height={isMobile ? 40 : 64}
                    data-testid={`payment_method_${logo}_logo`}
                    role="img"
                    aria-label={`${logo} payment method`}
                />
            ))}
        </div>
    );
}

export default PaymentMethodLogos;
