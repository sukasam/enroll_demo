import { render } from "@testing-library/react";
import { Control } from "react-hook-form";
import httpTools from "Shared/httpTools";
import FormDevTool from "./index";

jest.mock(
    "@hookform/devtools",
    () =>
        function MockDevTool({
            control
        }: {
            control: Control<any>;
        }): JSX.Element {
            return (
                <div data-testid="mock-devtool" data-control={control}>
                    DevTool
                </div>
            );
        }
);
jest.mock("@hookform/devtools", () => ({
    DevTool: ({ control }: { control: Control<any> }): JSX.Element => (
        <div data-testid="mock-devtool" data-control={control}>
            DevTool
        </div>
    )
}));

jest.mock("Shared/httpTools", () => ({
    isProd: false
}));

describe("FormDevTool", () => {
    const mockControl = {} as Control<any>;

    it("renders DevTool when not in production", () => {
        const { getByTestId } = render(<FormDevTool control={mockControl} />);
        expect(getByTestId("mock-devtool")).toBeInTheDocument();
    });

    it("does not render DevTool when in production", () => {
        (httpTools as any).isProd = true;

        const { queryByTestId } = render(<FormDevTool control={mockControl} />);
        expect(queryByTestId("mock-devtool")).not.toBeInTheDocument();

        (httpTools as any).isProd = false;
    });

    it("passes control prop to DevTool", () => {
        const { getByTestId } = render(<FormDevTool control={mockControl} />);
        const devTool = getByTestId("mock-devtool");
        expect(devTool).toHaveAttribute("data-control");
    });
});
