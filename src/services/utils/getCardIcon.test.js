import creditCardType from "credit-card-type";
import getCardIcon from "./getCardIcon";

// Mock the credit-card-type module
jest.mock("credit-card-type");

describe("getCardIcon", () => {
    it('should return "/cards/new.svg" when no card number is provided', () => {
        expect(getCardIcon()).toBe("/cards/new.svg");
        expect(getCardIcon("")).toBe("/cards/new.svg");
        expect(getCardIcon(null)).toBe("/cards/new.svg");
    });

    it('should return "/cards/visa.svg" for a Visa card', () => {
        creditCardType.mockReturnValue([{ type: "visa" }]);
        expect(getCardIcon("4111111111111111")).toBe("/cards/visa.svg");
    });

    it('should return "/cards/mastercard.svg" for a Mastercard', () => {
        creditCardType.mockReturnValue([{ type: "mastercard" }]);
        expect(getCardIcon("5555555555554444")).toBe("/cards/mastercard.svg");
    });

    it('should return "/cards/american-express.svg" for an American Express card', () => {
        creditCardType.mockReturnValue([{ type: "american-express" }]);
        expect(getCardIcon("378282246310005")).toBe(
            "/cards/american-express.svg"
        );
    });

    it('should return "/cards/discover.svg" for a Discover card', () => {
        creditCardType.mockReturnValue([{ type: "discover" }]);
        expect(getCardIcon("6011111111111117")).toBe("/cards/discover.svg");
    });

    it('should return "/cards/default.svg" for an unsupported card type', () => {
        creditCardType.mockReturnValue([{ type: "unsupported" }]);
        expect(getCardIcon("9999999999999999")).toBe("/cards/default.svg");
    });

    it('should return "/cards/default.svg" when creditCardType returns an empty array', () => {
        creditCardType.mockReturnValue([]);
        expect(getCardIcon("1234567890123456")).toBe("/cards/default.svg");
    });
});
