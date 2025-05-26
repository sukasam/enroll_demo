const validationRules = {
    username: {
        required: "error_login_username"
    },
    password: {
        minLength: {
            value: 8,
            message: "password_minimum_characters"
        }
    },
    recaptcha: {
        required: "error_login_recaptcha"
    }
};

export default validationRules;
