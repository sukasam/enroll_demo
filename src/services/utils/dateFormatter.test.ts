import convertDateToCustomFormat from "./dateFormatter";

describe("convertDateToCustomFormat", () => {
    it("should format date in MDY format by default", () => {
        const result = convertDateToCustomFormat("2023-05-15T14:30:00");
        expect(result).toBe("5/15/2023 2 P.M");
    });

    it("should format date in YMD format when specified", () => {
        const result = convertDateToCustomFormat("2023-05-15T14:30:00", "YMD");
        expect(result).toBe("2023/5/15 2 P.M");
    });

    it("should format date in DMY format when specified", () => {
        const result = convertDateToCustomFormat("2023-05-15T14:30:00", "DMY");
        expect(result).toBe("15/5/2023 2 P.M");
    });

    it("should handle midnight (12 AM) correctly", () => {
        const result = convertDateToCustomFormat("2023-05-15T00:30:00");
        expect(result).toBe("5/15/2023 12 A.M");
    });

    it("should handle noon (12 PM) correctly", () => {
        const result = convertDateToCustomFormat("2023-05-15T12:30:00");
        expect(result).toBe("5/15/2023 12 P.M");
    });

    it("should handle single-digit months and days", () => {
        const result = convertDateToCustomFormat("2023-01-05T10:30:00");
        expect(result).toBe("1/5/2023 10 A.M");
    });

    it("should handle invalid date strings", () => {
        const result = convertDateToCustomFormat("invalid-date");
        expect(result).toBe("Invalid Date");
    });

    it("should handle different timezones", () => {
        const result = convertDateToCustomFormat("2023-05-15T14:30:00Z");
        expect(result).toMatch(/\d{1,2}\/\d{1,2}\/2023 \d{1,2} (A\.M|P\.M)/);
    });
});
