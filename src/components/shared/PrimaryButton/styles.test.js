import generateStyles from "./styles";

// Mock the theme and css function
jest.mock("Styles/theme", () => ({
    colors: {
        primary: "#primary",
        secondary: "#secondary"
    },
    darkBlue: "#darkBlue",
    primaryButton: "primaryButtonStyle"
}));
jest.mock("@emotion/react", () => ({
    css: jest.fn((...args) => args.join("").replace(/\/\*#.*?\*\//, ""))
}));

describe("PrimaryButton styles", () => {
    it("should return default styles", () => {
        const result = generateStyles({});
        expect(result).toEqual(["primaryButtonStyle"]);
    });

    it("should add color styles", () => {
        const result = generateStyles({ color: "primary" });
        expect(result).toHaveLength(2);
        expect(result[1]).toContain("background:#primary");
        expect(result[1]).toContain("color:#ffffff");
    });

    it("should add size styles", () => {
        const result = generateStyles({ size: "md" });
        expect(result).toHaveLength(2);
        expect(result[1]).toContain("width:280px");
    });

    it("should add custom width", () => {
        const result = generateStyles({ width: "200px" });
        expect(result).toHaveLength(2);
        expect(result[1]).toContain("width:200px");
    });

    it("should combine multiple styles", () => {
        const result = generateStyles({
            color: "secondary",
            size: "sm",
            width: "250px"
        });
        expect(result).toHaveLength(4);
        expect(result[1]).toContain("background:#secondary");
        expect(result[2]).toContain("width:170px");
        expect(result[3]).toContain("width:250px");
    });
});
