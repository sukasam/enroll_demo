import { debounce } from "@mui/material";
import { getCookie } from "cookies-next";
import checkEmailExist from "Services/Hydra/checkEmailExist";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";

const MAX_EMAIL_LENGTH = 43;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_ALLOWED_SPECIAL_CHARS = [
    "@",
    "$",
    "!",
    "%",
    "*",
    "?",
    "&",
    "#",
    "."
];
const PASSWORD_SPECIAL_CHARS_REGEX = new RegExp(
    `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[${PASSWORD_ALLOWED_SPECIAL_CHARS.map(
        c => `\\${c}`
    ).join("")}])[^\\s]*$`
);

const debouncedCheckEmailExist = debounce(
    async (email: string, callback: (result: boolean | string) => void) => {
        try {
            const isCookieEnabled = getCookie("isCookieEnabled") === "true";
            const response = await checkEmailExist({ email });

            if (!response.exists) {
                callback(true);
            } else {
                if (isCookieEnabled === false) {
                    mixpanelService.trackEvent(
                        MixpanelEvent.REGISTRATION_EMAIL_ALREADY_EXISTS_ERROR,
                        {
                            email
                        }
                    );
                }
                callback("error_create_account_email_already_registered");
            }
        } catch (error) {
            console.error("Email validation error:", error);
            callback("error_create_account_email_invalid");
        }
    },
    500
);

const validateEmail = (email: string): Promise<boolean | string> =>
    new Promise(resolve => {
        if (email.length > MAX_EMAIL_LENGTH) {
            resolve("error_invalid_email_length");
        } else if (!EMAIL_REGEX.test(email)) {
            resolve("error_create_account_email_format");
        } else {
            debouncedCheckEmailExist(email, resolve);
        }
    });

const validatePassword = (value: string): string | boolean => {
    if (value.length < 8) {
        return "create_account_password_minimum_characters";
    }
    // Check if password contains any special character not in allowed list
    const hasInvalidSpecialChar = /[^A-Za-z0-9@$!%*?&#.]/.test(value);
    if (hasInvalidSpecialChar) {
        return "create_account_password_special_characters_allowed";
    }
    if (!PASSWORD_SPECIAL_CHARS_REGEX.test(value)) {
        return "create_account_password_special_characters";
    }
    if (value.length > 1000) {
        return "password_characters_exceed_limit";
    }
    return true;
};

const validationRules = {
    fullName: {
        required: "create_account_full_name",
        validate: (value: string, country?: string): string | boolean => {
            if (value.trim() === "") {
                return "create_account_full_name";
            }

            // Add Japanese language validation for JP country
            if (country === "JP") {
                // Japanese characters regex (includes hiragana, katakana, and kanji)
                const japaneseRegex =
                    /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF\s]+$/;
                if (!japaneseRegex.test(value)) {
                    return "fullname_japanese_characters";
                }
            }

            return true;
        }
    },
    fullNameEn: {
        required: "create_account_full_name_en",
        validate: (value: string, country?: string): string | boolean => {
            if (value.trim() === "") {
                return "create_account_full_name_en";
            }

            // For JP country, validate English characters and name format
            if (country === "JP") {
                // English characters only (letters and spaces)
                const englishRegex = /^[A-Za-z\s]+$/;
                if (!englishRegex.test(value)) {
                    return "fullname_english_characters";
                }

                // Check for exactly one space between characters (ignoring leading/trailing spaces)
                const trimmedValue = value.trim();
                const spaceCount = (trimmedValue.match(/\s/g) || []).length;
                if (spaceCount !== 1) {
                    return "error_full_name_format";
                }

                // Check for proper name format
                const parts = trimmedValue.split(/\s+/);
                if (parts.length !== 2) {
                    return "error_full_name_format";
                }

                // Check if both parts are not empty and start with a letter
                if (
                    !parts[0] ||
                    !parts[1] ||
                    !/^[A-Za-z]/.test(parts[0]) ||
                    !/^[A-Za-z]/.test(parts[1])
                ) {
                    return "error_full_name_format";
                }
            }

            return true;
        }
    },
    firstName: {
        required: "create_account_first_name",
        validate: (value: string): string | boolean => {
            if (value.trim() === "") {
                return "create_account_first_name";
            }

            return true;
        }
    },
    lastName: {
        required: "create_account_last_name",
        validate: (value: string): string | boolean => {
            if (value.trim() === "") {
                return "create_account_last_name";
            }

            return true;
        }
    },
    phoneNumber: {
        required: "create_account_phone_number",
        pattern: {
            value: /^\+?(\d{1,3})?[-. ]?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$/,
            message: "error_create_account_phone_number_format"
        }
    },
    email: {
        required: "create_account_email_address",
        validate: validateEmail
    },
    password: {
        required: "create_account_password",
        validate: validatePassword
    },
    agreeToTerms: {
        required: "create_account_agreements"
    },
    agreeToOnlineRegistration: {
        required: "agreement_online_registration"
    },
    agreeToMemberApplicationGuide: {
        required: "error_agreement_member_application_guide"
    }
};

export default validationRules;
