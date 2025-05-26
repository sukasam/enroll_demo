import getRefID from "Hydra/getRefID";
import isRefValid from "./refValidation";

jest.mock("Hydra/getRefID");

describe("isRefValid", () => {
    it("should return invalid result for undefined ref", async () => {
        const result = await isRefValid(undefined);
        expect(result).toEqual({
            isValid: false,
            unicityID: "",
            refResults: null
        });
    });

    it("should return invalid result for ref shorter than 3 characters", async () => {
        const result = await isRefValid("12");
        expect(result).toEqual({
            isValid: false,
            unicityID: "12",
            refResults: null
        });
    });

    it("should return invalid result for ref longer than 20 characters", async () => {
        const result = await isRefValid("123456789012345678901");
        expect(result).toEqual({
            isValid: false,
            unicityID: "123456789012345678901",
            refResults: null
        });
    });

    it("should return valid result for valid numeric ref", async () => {
        const mockResult = {
            ok: true,
            items: [{ unicity: "123456", someOtherProp: "value" }]
        };
        (getRefID as jest.Mock).mockResolvedValue(mockResult);

        const result = await isRefValid("123456");
        expect(result).toEqual({
            isValid: true,
            unicityID: "123456",
            refResults: mockResult.items[0]
        });
    });

    it("should return valid result for valid alphanumeric ref", async () => {
        const mockResult = {
            ok: true,
            items: [{ unicity: "abc123", someOtherProp: "value" }]
        };
        (getRefID as jest.Mock).mockResolvedValue(mockResult);

        const result = await isRefValid("abc123");
        expect(result).toEqual({
            isValid: true,
            unicityID: "abc123",
            refResults: mockResult.items[0]
        });
    });

    it("should return invalid result when getRefID returns not ok result", async () => {
        const mockResult = { ok: false };
        (getRefID as jest.Mock).mockResolvedValue(mockResult);

        const result = await isRefValid("123456");
        expect(result).toEqual({
            isValid: false,
            unicityID: "",
            refResults: null
        });
    });
});
