import validationRules from "./validationRules";

describe("Validation Rules", () => {
    describe("Password Validation Rules", () => {
        const { password } = validationRules;

        it("password is required", () => {
            expect(password.required).toBe("create_account_password");
        });

        describe("password validation", () => {
            it("validates minimum length", () => {
                expect(password.validate("Pass1!")).toBe(
                    "create_account_password_minimum_characters"
                );
                expect(password.validate("Password1!")).toBe(true);
            });

            it("rejects passwords with invalid special characters", () => {
                const invalidSpecialChars = [
                    "^",
                    "~",
                    "`",
                    "(",
                    ")",
                    "+",
                    "=",
                    "[",
                    "]",
                    "{",
                    "}",
                    "|",
                    "\\",
                    ";",
                    ":",
                    "'",
                    '"',
                    ",",
                    "<",
                    ">",
                    "/"
                ];
                invalidSpecialChars.forEach(char => {
                    expect(password.validate(`Password1${char}`)).toBe(
                        "create_account_password_special_characters_allowed"
                    );
                });
            });

            it("accepts passwords with valid special characters", () => {
                const validSpecialChars = [
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
                validSpecialChars.forEach(char => {
                    expect(password.validate(`Password1${char}`)).toBe(true);
                });
            });

            it("requires lowercase, uppercase, number and special character", () => {
                const testCases = [
                    {
                        password: "password1!",
                        error: "create_account_password_special_characters"
                    }, // no uppercase
                    {
                        password: "PASSWORD1!",
                        error: "create_account_password_special_characters"
                    }, // no lowercase
                    {
                        password: "Password!",
                        error: "create_account_password_special_characters"
                    }, // no number
                    {
                        password: "Password1",
                        error: "create_account_password_special_characters"
                    } // no special char
                ];

                testCases.forEach(({ password: testPassword, error }) => {
                    expect(password.validate(testPassword)).toBe(error);
                });
            });

            it("accepts valid passwords", () => {
                const validPasswords = [
                    "Password1!",
                    "C0mpl3x@Pass",
                    "Str0ng&P@ssw0rd",
                    "V3ryL0ng.P@ssw0rd",
                    "Password123.",
                    "P@ssw0rd.",
                    "it.Pass1"
                ];
                validPasswords.forEach(pass => {
                    expect(password.validate(pass)).toBe(true);
                });
            });
        });
    });

    describe("Name Validation Rules", () => {
        describe("firstName", () => {
            const { firstName } = validationRules;

            it("firstName is required", () => {
                expect(firstName.required).toBe("create_account_first_name");
            });

            it("firstName validation rejects empty spaces", () => {
                expect(firstName.validate("   ")).toBe(
                    "create_account_first_name"
                );
            });

            it("firstName validation accepts valid names", () => {
                expect(firstName.validate("John")).toBe(true);
                expect(firstName.validate("Mary Jane")).toBe(true);
            });
        });

        describe("lastName", () => {
            const { lastName } = validationRules;

            it("lastName is required", () => {
                expect(lastName.required).toBe("create_account_last_name");
            });

            it("lastName validation rejects empty spaces", () => {
                expect(lastName.validate("   ")).toBe(
                    "create_account_last_name"
                );
            });

            it("lastName validation accepts valid names", () => {
                expect(lastName.validate("Doe")).toBe(true);
                expect(lastName.validate("Van Dyke")).toBe(true);
            });
        });
    });
});
