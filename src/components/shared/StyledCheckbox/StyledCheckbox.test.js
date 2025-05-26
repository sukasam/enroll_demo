import { fireEvent, render, screen } from "@testing-library/react";
import StyledCheckbox from "./index.js";

describe("StyledCheckbox", () => {
    it("renders with unchecked icon by default", () => {
        render(<StyledCheckbox />);
        expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("renders with checked icon when checked", () => {
        render(<StyledCheckbox checked />);
        expect(
            screen.getByRole("checkbox", { checked: true })
        ).toBeInTheDocument();
    });

    it("calls onChange function when clicked", () => {
        const onChange = jest.fn();
        render(<StyledCheckbox onChange={onChange} />);

        const checkbox = screen.getByRole("checkbox");
        fireEvent.click(checkbox);

        expect(onChange).toHaveBeenCalled();
    });
});
