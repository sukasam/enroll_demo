import redactSensitiveDataFromLog from "./redactSensitiveDataFromLog";

describe("redactSensitiveDataFromLog", () => {
    it("should return an empty object if input is falsy", () => {
        expect(redactSensitiveDataFromLog(null)).toEqual({});
        expect(redactSensitiveDataFromLog(undefined)).toEqual({});
        expect(redactSensitiveDataFromLog("")).toEqual({});
    });

    it("should redact sensitive data from a simple object", () => {
        const input = {
            username: "testuser",
            password: "secretpassword",
            email: "test@example.com"
        };
        const expected = {
            username: "testuser",
            password: "[sensitive_data]",
            email: "test@example.com"
        };
        expect(redactSensitiveDataFromLog(input)).toEqual(expected);
    });

    it("should redact sensitive data from a nested object", () => {
        const input = {
            user: {
                username: "testuser",
                password: "secretpassword"
            },
            payment: {
                creditCardNumber: "1234567890123456",
                creditCardSecurityCode: "123"
            }
        };
        const expected = {
            user: {
                username: "testuser",
                password: "[sensitive_data]"
            },
            payment: {
                creditCardNumber: "[sensitive_data]",
                creditCardSecurityCode: "[sensitive_data]"
            }
        };
        expect(redactSensitiveDataFromLog(input)).toEqual(expected);
    });

    it("should redact sensitive data from a string input", () => {
        const input = '{"username":"testuser","password":"secretpassword"}';
        const expected = {
            username: "testuser",
            password: "[sensitive_data]"
        };
        expect(redactSensitiveDataFromLog(input)).toEqual(expected);
    });

    it("should redact sensitive data within methodDetails", () => {
        const input = {
            methodDetails: {
                password: "secretpassword",
                creditCardNumber: "1234567890123456"
            },
            otherDetails: {
                password: "anotherpassword"
            }
        };
        const expected = {
            methodDetails: {
                password: "[sensitive_data]",
                creditCardNumber: "[sensitive_data]"
            },
            otherDetails: {
                password: "[sensitive_data]"
            }
        };
        expect(redactSensitiveDataFromLog(input)).toEqual(expected);
    });

    it("should handle complex nested structures", () => {
        const input = {
            user: {
                credentials: {
                    password: "secretpassword"
                }
            },
            payment: [
                { creditCardNumber: "1234", creditCardExpires: "12/24" },
                { creditCardNumber: "5678", creditCardExpires: "01/25" }
            ],
            recaptchaToken: "sometoken"
        };
        const expected = {
            user: {
                credentials: {
                    password: "[sensitive_data]"
                }
            },
            payment: [
                {
                    creditCardNumber: "[sensitive_data]",
                    creditCardExpires: "[sensitive_data]"
                },
                {
                    creditCardNumber: "[sensitive_data]",
                    creditCardExpires: "[sensitive_data]"
                }
            ],
            recaptchaToken: "[sensitive_data]"
        };
        expect(redactSensitiveDataFromLog(input)).toEqual(expected);
    });

    it("should return an error object if JSON parsing fails", () => {
        const originalConsoleError = console.error;
        console.error = jest.fn();

        const input = '{"invalid": "json",}';
        const result = redactSensitiveDataFromLog(input);

        expect(result).toEqual({
            message: "issue with redacting data",
            error: expect.any(SyntaxError)
        });
        expect(console.error).toHaveBeenCalled();

        console.error = originalConsoleError;
    });

    it("should not modify non-sensitive data", () => {
        const input = {
            username: "testuser",
            email: "test@example.com",
            age: 30
        };
        expect(redactSensitiveDataFromLog(input)).toEqual(input);
    });
});
