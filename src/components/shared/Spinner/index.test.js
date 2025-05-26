import { render } from "@testing-library/react";
import Spinner from "./index";

jest.mock("@emotion/react", () => ({
    css: jest.fn((...args) => args)
}));

describe("Spinner", () => {
    it("renders without crashing", () => {
        render(<Spinner />);
    });

    it("applies default props correctly", () => {
        const { container } = render(<Spinner />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveAttribute("height", "1em");
        expect(svg).toHaveAttribute("width", "1em");
    });

    it("applies custom height prop correctly", () => {
        const { container } = render(<Spinner height="2em" />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveAttribute("height", "2em");
        expect(svg).toHaveAttribute("width", "2em");
    });

    it("uses white stroke color by default", () => {
        const { container } = render(<Spinner />);
        const circle = container.querySelector("circle");
        const path = container.querySelector("path");
        expect(circle).toHaveAttribute("stroke", "white");
        expect(path).toHaveAttribute("stroke", "white");
    });

    it("uses dark stroke color when dark prop is true", () => {
        const { container } = render(<Spinner dark />);
        const circle = container.querySelector("circle");
        const path = container.querySelector("path");
        expect(circle).toHaveAttribute("stroke", "#99BCDF");
        expect(path).toHaveAttribute("stroke", "#99BCDF");
    });

    it("sets correct viewBox", () => {
        const { container } = render(<Spinner />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    });

    it("sets correct circle attributes", () => {
        const { container } = render(<Spinner />);
        const circle = container.querySelector("circle");
        expect(circle).toHaveAttribute("cx", "12");
        expect(circle).toHaveAttribute("cy", "12");
        expect(circle).toHaveAttribute("r", "10");
        expect(circle).toHaveAttribute("stroke-opacity", "0.5");
        expect(circle).toHaveAttribute("stroke-width", "3");
    });

    it("sets correct path attributes", () => {
        const { container } = render(<Spinner />);
        const path = container.querySelector("path");
        expect(path).toHaveAttribute(
            "d",
            "M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C16.1967 2 19.7896 4.58521 21.2731 8.25"
        );
        expect(path).toHaveAttribute("stroke-linecap", "round");
        expect(path).toHaveAttribute("stroke-width", "3");
    });
});
