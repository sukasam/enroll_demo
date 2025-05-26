import { render, screen } from "@testing-library/react";
import InfoTooltip from "./index";

jest.mock("@mui/material", () => ({
    Tooltip: ({
        children,
        title,
        ...props
    }: {
        children: React.ReactNode;
        title: string;
    }): React.ReactNode => (
        <div data-testid="mui-tooltip" data-title={title} {...props}>
            {children}
        </div>
    )
}));

jest.mock("next/image", () => ({
    __esModule: true,
    // eslint-disable-next-line
    default: (props: any): React.ReactNode => <img alt="mocked" {...props} />
}));

describe("InfoTooltip", () => {
    it("renders the info icon", () => {
        render(<InfoTooltip content="Test content" />);
        const icon = screen.getByTestId("tooltip_icon");
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute("src", "/info-alt.svg");
        expect(icon).toHaveAttribute("alt", "Info icon");
    });

    it("passes content to Tooltip title", () => {
        render(<InfoTooltip content="Test content" />);
        const tooltip = screen.getByTestId("mui-tooltip");
        expect(tooltip).toHaveAttribute("data-title", "Test content");
    });

    it("uses custom placement when specified", () => {
        render(<InfoTooltip content="Test content" placement="top" />);
        const tooltip = screen.getByTestId("mui-tooltip");
        expect(tooltip).toHaveAttribute("placement", "top");
    });

    it("applies correct style to Tooltip", () => {
        render(<InfoTooltip content="Test content" />);
        const tooltip = screen.getByTestId("mui-tooltip");
        expect(tooltip).toHaveStyle({ marginLeft: 4 });
    });

    it("sets correct touch delay props", () => {
        render(<InfoTooltip content="Test content" />);
        const tooltip = screen.getByTestId("mui-tooltip");
        expect(tooltip).toHaveAttribute("enterTouchDelay", "0");
        expect(tooltip).toHaveAttribute("leaveTouchDelay", "5000");
    });
});
