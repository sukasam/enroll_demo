import { SupportedCountryConfig } from "Constants/countryConfig/types";

export const isPOBox = (address: string): boolean => {
    const poBoxPatterns = [
        /\b[P|p]?(OST|ost)?\.?\s*[O|o|0]?(ffice|FFICE)?\.?\s*[B|b][O|o|0]?[X|x]?\.?\s+[#]?(\d+)\b/,
        /\bHC\s*BOX\s*\d+\b/i,
        /\bRURAL\s*ROUTE\s*\d+\b/i,
        /\b(APO|FPO|DPO)\s*(AA|AE|AP)\s*\d{5}(-\d{4})?\b/i,
        /\bUNIT\s*\d+,?\s*BOX\s*\d+\b/i,
        /\bGENERAL\s*DELIVERY\b/i,
        /\bPARCEL\s*LOCKER\s*[#]?\d+\b/i,
        /\bPMB\s*[#]?\d+\b/i,
        /\bFORWARDING\s*TO\b/i,
        /\bCOMMUNITY\s*MAILBOX\s*[#]?\d+\b/i,
        /\bUSS\s+\w+\b/i,
        /\b[B|b][O|o][X|x]\s*[#]?\d+\b/
    ];

    return poBoxPatterns.some(pattern => pattern.test(address));
};

export const validateZipCode = (
    translate: any,
    countryConfig: SupportedCountryConfig | undefined
): object => {
    let rules: object = {
        required: translate("shipping_zip_code")
    };

    // Validate zip code length range
    rules = zipArrayValidation(rules, translate, countryConfig);

    // Validate zip code minimum and maximum length
    rules = zipMinLengthValidation(rules, translate, countryConfig);

    // Validate zip code pattern
    rules = zipPatternValidation(rules, translate, countryConfig);

    return rules;
};

const zipArrayValidation = (
    rules: object,
    translate: any,
    countryConfig: SupportedCountryConfig | undefined
): object => {
    const zipLength = countryConfig?.marketExceptions.zipLength;
    if (Array.isArray(zipLength)) {
        return {
            ...rules,
            minLength: {
                value: zipLength[0],
                message: translate("shipping_zip_code_invalid")
            },
            maxLength: {
                value: zipLength[1],
                message: translate("shipping_zip_code_invalid")
            }
        };
    }
    return rules;
};

const zipMinLengthValidation = (
    rules: object,
    translate: any,
    countryConfig: SupportedCountryConfig | undefined
): object => {
    const zipLength = countryConfig?.marketExceptions.zipLength;
    if (!Array.isArray(zipLength)) {
        return {
            ...rules,
            minLength: {
                value: zipLength,
                message: translate("shipping_zip_code_invalid")
            },
            maxLength: {
                value: zipLength,
                message: translate("shipping_zip_code_invalid")
            }
        };
    }
    return rules;
};

const zipPatternValidation = (
    rules: object,
    translate: any,
    countryConfig: SupportedCountryConfig | undefined
): object => {
    const zipPattern = countryConfig?.marketExceptions.zipPattern;
    return {
        ...rules,
        pattern: {
            value: zipPattern ?? /^\d{3}(-?\d{4})$/,
            message: translate("shipping_zip_code_invalid")
        }
    };
};

const validationRules = {
    name: {
        required: "shipping_full_name"
    },
    country: {
        required: "shipping_country"
    },
    address: {
        required: "shipping_ship_to_address",
        validate: {
            notPOBox: (value: string): string | boolean =>
                !isPOBox(value) || "shipping_po_box_error"
        }
    },
    address2: {
        validate: {
            notPOBox: (value: string): string | boolean =>
                !isPOBox(value) || "shipping_po_box_error"
        }
    },
    city: {
        required: "shipping_city"
    },
    state: {
        required: "shipping_state"
    },
    zip: {
        required: "shipping_zip_code"
    }
};

export default validationRules;
