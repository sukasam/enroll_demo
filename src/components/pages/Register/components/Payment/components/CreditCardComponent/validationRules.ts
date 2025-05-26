import { CountryConfig } from "Constants/countryConfig/types";
import { RegisterOptions } from "react-hook-form";

interface CreditCardValidationRules {
    creditCardNumber: RegisterOptions;
    cvc: RegisterOptions;
    expiry: RegisterOptions;
}

// Credit card validation helpers
const cleanCreditCardNumber = (value: string): string =>
    value.replace(/\s/g, "");

const isAmexCard = (cardNumber: string): boolean => /^3[47]/.test(cardNumber);

const validateCardLength = (cardNumber: string, isAmex: boolean): boolean => {
    const expectedLength = isAmex ? 15 : 16;
    const regex = new RegExp(`^[0-9]{${expectedLength}}$`);
    return regex.test(cardNumber);
};

const validateExpiryDate = (expiry: string): boolean | string => {
    const [month, year] = expiry.split("/").map(Number);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear() % 100;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return "error_invalid_expiration_date";
    }
    return true;
};

const SUPPORTED_CARD_PATTERNS = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard:
        /^5[1-5][0-9]{14}|^(222[1-9]|22[3-9]\\d|2[3-6]\\d{2}|27[0-1]\\d|2720)[0-9]{12}$/,
    amex: /^3[47][0-9]{13}$/,
    discover: /^6(?:011|5)/,
    jcb: /^35/
};

const createValidationRules = (
    countryConfig?: CountryConfig
): CreditCardValidationRules => ({
    creditCardNumber: {
        required: "payment_credit_card",
        validate: (value: string): boolean | string => {
            const cleanNumber = cleanCreditCardNumber(value);
            const amexCard = isAmexCard(cleanNumber);
            if (!validateCardLength(cleanNumber, amexCard)) {
                return "error_payment_credit_card_must_be_16_digits";
            }

            const isSupported = (countryConfig?.paymentLogos || []).some(
                cardType =>
                    cardType in SUPPORTED_CARD_PATTERNS &&
                    SUPPORTED_CARD_PATTERNS[
                        cardType as keyof typeof SUPPORTED_CARD_PATTERNS
                    ].test(cleanNumber)
            );

            if (!isSupported) {
                return "error_payment_card_type_not_match";
            }

            return true;
        }
    },
    cvc: {
        required: "payment_security_code",
        pattern: {
            value: /^[0-9]{3,4}$/,
            message: "error_payment_cvc_must_be_3_or_4_digits"
        }
    },
    expiry: {
        required: "payment_expiration",
        pattern: {
            value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
            message: "error_payment_expiration_must_be_in_format_mm_yy"
        },
        validate: validateExpiryDate
    }
});

export default createValidationRules;
