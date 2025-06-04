const validationRules = {
    phoneNumber: {
        required: "Phone number is required",
        pattern: {
            value: /^\+?(\d{1,3})?[-. ]?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$/,
            message: "Entered value does not match phone number format"
        }
    },
    firstName: { required: "First name is required" },
    lastName: { required: "Last name is required" },
    fullName: { required: "Full name is required" },
    fullNameEn: { required: "Full name in English is required" },
    email: { required: "Email is required", pattern: /^\S+@\S+\.\S+$/ }
};

export default validationRules;
