import { render } from "@testing-library/react";
import Checkmark from "./index";

describe("Checkmark", () => {
    it("should render the component", () => {
        const { getByRole } = render(<Checkmark />);
        const svgElement = getByRole("img");
        expect(svgElement).toBeInTheDocument();
    });

    it("should have the correct SVG attributes", () => {
        const { getByRole } = render(<Checkmark />);
        const svgElement = getByRole("img");

        expect(svgElement.getAttribute("fill")).toBe("none");
        expect(svgElement.getAttribute("height")).toBe("18");
        expect(svgElement.getAttribute("viewBox")).toBe("0 0 18 18");
        expect(svgElement.getAttribute("width")).toBe("18");
        expect(svgElement.getAttribute("xmlns")).toBe(
            "http://www.w3.org/2000/svg"
        );
    });

    it("should have the correct paths with currentColor", () => {
        const { getAllByRole } = render(<Checkmark />);
        const pathElements =
            getAllByRole("img")[0].getElementsByTagName("path");

        expect(pathElements[0].getAttribute("fill")).toBe("currentColor");
        expect(pathElements[1].getAttribute("fill")).toBe("currentColor");
    });

    it("should match snapshot", () => {
        const { container } = render(<Checkmark />);
        expect(container.firstChild).toMatchSnapshot();
    });
});
