import {
    cardNumberFormatter,
    expirationDateFormatter,
    ibanFormatter,
    upperCaseFormatter
} from "./formatters";

describe("upperCaseFormatter", () => {
    it("should return an uppercase string", () => {
        const input = "hello world";
        const expectedOutput = "HELLO WORLD";
        const actualOutput = upperCaseFormatter(input);
        expect(actualOutput).toEqual(expectedOutput);
    });
});

describe("expirationDateFormatter", () => {
    it("should format a date with a slash", () => {
        const input = "1222";
        const expectedOutput = "12/22";
        const actualOutput = expirationDateFormatter(input);
        expect(actualOutput).toEqual(expectedOutput);
    });

    it("should not format a date with a slash", () => {
        const input = "12/22";
        const expectedOutput = "12/22";
        const actualOutput = expirationDateFormatter(input);
        expect(actualOutput).toEqual(expectedOutput);
    });

    it("should not format a date with a slash if it appears after the second character", () => {
        const input = "1/22";
        const expectedOutput = "1/22";
        const actualOutput = expirationDateFormatter(input);
        expect(actualOutput).toEqual(expectedOutput);
    });
});

describe("cardNumberFormatter", () => {
    it("should format a card number with spaces", () => {
        const input = "1234567812345678";
        const expectedOutput = "1234 5678 1234 5678";
        const actualOutput = cardNumberFormatter(input);
        expect(actualOutput).toEqual(expectedOutput);
    });

    it("should not format a card number with spaces if it already has spaces", () => {
        const input = "1234 5678 1234 5678";
        const expectedOutput = "1234 5678 1234 5678";
        const actualOutput = cardNumberFormatter(input);
        expect(actualOutput).toEqual(expectedOutput);
    });
});

describe("ibanFormatter", () => {
    it("should format an IBAN with spaces and uppercase letters", () => {
        const input = "gb29 nwbk 6016 1331 9268 19";
        const expectedOutput = "GB29 NWBK 6016 1331 9268 19";
        const actualOutput = ibanFormatter(input);
        expect(actualOutput).toEqual(expectedOutput);
    });

    it("should not format an IBAN with spaces if it already has spaces", () => {
        const input = "GB29 NWBK 6016 1331 9268 19";
        const expectedOutput = "GB29 NWBK 6016 1331 9268 19";
        const actualOutput = ibanFormatter(input);
        expect(actualOutput).toEqual(expectedOutput);
    });

    it("should not format an IBAN with spaces if it has less than 4 characters", () => {
        const input = "GB29";
        const expectedOutput = "GB29";
        const actualOutput = ibanFormatter(input);
        expect(actualOutput).toEqual(expectedOutput);
    });
});
