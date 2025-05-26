import formatHref from "./formatHref";

describe("formatHref", () => {
    it('should remove "customers/" and everything before it', () => {
        expect(formatHref("https://example.com/customers/123")).toBe("123");
    });

    it('should handle multiple occurrences of "customers/" and remove up to the last one', () => {
        expect(
            formatHref("https://example.com/customers/old/customers/456")
        ).toBe("456");
    });

    it('should return the original string if "customers/" is not present', () => {
        expect(formatHref("https://example.com/some/path")).toBe(
            "https://example.com/some/path"
        );
    });

    it('should return an empty string if "customers/" is at the end', () => {
        expect(formatHref("https://example.com/path/customers/")).toBe("");
    });

    it("should handle empty input string", () => {
        expect(formatHref("")).toBe("");
    });

    it('should handle input with only "customers/"', () => {
        expect(formatHref("customers/")).toBe("");
    });

    it('should preserve query parameters after "customers/"', () => {
        expect(
            formatHref("https://example.com/customers/789?param=value")
        ).toBe("789?param=value");
    });

    it('should handle URL-encoded characters after "customers/"', () => {
        expect(formatHref("https://example.com/customers/user%20name")).toBe(
            "user%20name"
        );
    });

    it('should handle "customers/" at the beginning of the string', () => {
        expect(formatHref("customers/123")).toBe("123");
    });

    it('should handle case-sensitive "customers/"', () => {
        expect(formatHref("https://example.com/Customers/123")).toBe(
            "https://example.com/Customers/123"
        );
    });
});
