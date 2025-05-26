type ValidationRules = {
    [key: string]: any; // Specify the structure of the validation rules here
};

const checkTCNumber = (value: string): boolean => {
    // Calculate totalX (Sum of the first 10 digits)
    let totalX = 0;
    for (let i = 0; i < 10; i += 1) {
        totalX += parseInt(value[i], 10);
    }
    const isRuleX = totalX % 10 === parseInt(value[10], 10);

    // Calculate totalY1 (Sum of digits at odd positions)
    let totalY1 = 0;
    for (let i = 0; i < 9; i += 2) {
        totalY1 += parseInt(value[i], 10);
    }

    // Calculate totalY2 (Sum of digits at even positions)
    let totalY2 = 0;
    for (let i = 1; i < 9; i += 2) {
        totalY2 += parseInt(value[i], 10);
    }

    const isRuleY = (totalY1 * 7 - totalY2) % 10 === parseInt(value[9], 10);

    return isRuleX && isRuleY;
};
const validationRules: ValidationRules = {
    eSignature: {
        required: "agreement_must_sign",
        pattern: {
            value: /^[A-Za-z ]{2,32}$/,
            message: "error_invalid_signature"
        }
    },
    RFC: {
        required: "agreement_must_enter_rfc",
        pattern: {
            value: /^[A-Z]{4}\d{6}[A-Z0-9]{3}$/,
            message: "agreement_invalid_rfc"
        }
    },
    CURP: {
        required: "agreement_must_enter_curp",
        pattern: {
            value: /^[A-Z]{4}\d{6}[A-Z]{6}\d{2}$/,
            message: "agreement_invalid_curp"
        }
    },
    PID: {
        required: "agreement_must_enter_pid",
        pattern: {
            value: /^\d{11}$/,
            message: "agreement_invalid_pid"
        }
    },
    TC: {
        required: "agreement_must_enter_tc",
        pattern: {
            value: /^\d{11}$/,
            message: "agreement_invalid_tc"
        },
        validate: {
            validTC: (value: string): true | string =>
                checkTCNumber(value) ? true : "agreement_invalid_tc"
        }
    },
    PAN: {
        pattern: {
            value: /^[A-Z0-9]{10}$/,
            message: "agreement_invalid_pan"
        }
    }
};

export default validationRules;
