import { HumanName } from "services/Hydra/order/types";
import { getFirstValidFullName, getFullName } from "./fullName";

describe("getFullName", () => {
    it("should return empty string when no argument is provided", () => {
        expect(getFullName()).toBe("");
    });

    it("should return full name when firstName and lastName are provided", () => {
        const humanName = { firstName: "John", lastName: "Doe" };
        expect(getFullName(humanName)).toBe("John Doe");
    });

    it("should prioritize firstName and lastName over fullName", () => {
        const humanName = {
            firstName: "John",
            lastName: "Smith",
            fullName: "John Doe"
        };
        expect(getFullName(humanName)).toBe("John Smith");
    });

    it("should return empty string when an empty object is provided", () => {
        expect(getFullName({})).toBe("");
    });

    it("should return empty string when only firstName is provided", () => {
        const humanName = { firstName: "John" };
        expect(getFullName(humanName)).toBe("");
    });

    it("should return empty string when only lastName is provided", () => {
        const humanName = { lastName: "Doe" };
        expect(getFullName(humanName)).toBe("");
    });

    it("should handle whitespace-only strings", () => {
        const humanName = { firstName: "  ", lastName: "   " };
        expect(getFullName(humanName)).toBe("");
    });

    it("should handle fullName with only whitespace", () => {
        const humanName = { fullName: "   " };
        expect(getFullName(humanName)).toBe("");
    });
});

describe("getFirstValidFullName", () => {
    it("should return empty string when an empty array is provided", () => {
        expect(getFirstValidFullName([])).toBe("");
    });

    it("should return empty string when an empty array is provided", () => {
        expect(getFirstValidFullName([])).toBe("");
    });

    it("should return the first valid full name when an array of human names is provided", () => {
        const humanNames = [
            { firstName: "John", lastName: "Doe" },
            { firstName: "Jane", lastName: "Smith" },
            { fullName: "Jane Smith" },
            { firstName: "Alice", lastName: "" }
        ];
        expect(getFirstValidFullName(humanNames)).toBe("John Doe");
    });

    it("should return empty string when no valid full name is found", () => {
        const humanNames = [
            { firstName: "John", lastName: "" },
            { fullName: "" },
            { firstName: "", lastName: "Doe" }
        ];
        expect(getFirstValidFullName(humanNames)).toBe("");
    });
    it("should handle null/undefined values in array", () => {
        const humanNames = [
            null,
            undefined,
            { firstName: "John", lastName: "Doe" }
        ] as HumanName[];

        expect(getFirstValidFullName(humanNames)).toBe("John Doe");
    });
    it("should handle array with only invalid names", () => {
        const humanNames = [
            { firstName: "  ", lastName: "  " },
            { fullName: "   " },
            {}
        ];
        expect(getFirstValidFullName(humanNames)).toBe("");
    });
});
