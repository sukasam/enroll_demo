import CustomError from "./customError";

describe("CustomError", () => {
    it("should create an instance with the provided code and message", () => {
        const error = new CustomError({ code: 404, message: "Not Found" });
        expect(error).toBeInstanceOf(CustomError);
        expect(error).toBeInstanceOf(Error);
        expect(error.code).toBe(404);
        expect(error.message).toBe("Not Found");
    });

    it("should have the correct name property", () => {
        const error = new CustomError({
            code: 500,
            message: "Internal Server Error"
        });
        expect(error.name).toBe("Error");
    });

    it("should be throwable", () => {
        expect(() => {
            throw new CustomError({ code: 400, message: "Bad Request" });
        }).toThrow(CustomError);
    });

    it("should preserve the error message when caught", () => {
        try {
            throw new CustomError({ code: 403, message: "Forbidden" });
        } catch (error) {
            expect(error).toBeInstanceOf(CustomError);
            if (error instanceof CustomError) {
                expect(error.code).toBe(403);
                expect(error.message).toBe("Forbidden");
            } else {
                fail("Error is not an instance of CustomError");
            }
        }
    });

    it("should allow accessing the code property", () => {
        const error = new CustomError({ code: 418, message: "I'm a teapot" });
        expect(error.code).toBe(418);
    });

    it("should work with different code and message combinations", () => {
        const testCases = [
            { code: 200, message: "OK" },
            { code: 201, message: "Created" },
            { code: 204, message: "No Content" },
            { code: 400, message: "Bad Request" },
            { code: 401, message: "Unauthorized" },
            { code: 404, message: "Not Found" },
            { code: 500, message: "Internal Server Error" }
        ];

        testCases.forEach(({ code, message }) => {
            const error = new CustomError({ code, message });
            expect(error.code).toBe(code);
            expect(error.message).toBe(message);
        });
    });

    it("should handle optional error_code property", () => {
        const errorWithCode = new CustomError({
            code: 400,
            message: "Bad Request",
            error_code: "1603"
        });
        expect(errorWithCode.errorCode).toBe("1603");

        const errorWithoutCode = new CustomError({
            code: 400,
            message: "Bad Request"
        });
        expect(errorWithoutCode.errorCode).toBeUndefined();
    });
});
