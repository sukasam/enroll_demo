import { render } from "@testing-library/react";
import PageSpinner from "./index";

jest.mock(
    "Components/shared/Spinner",
    () =>
        function MockSpinner(props: any): JSX.Element {
            return <div data-testid="mock-spinner" {...props} />;
        }
);

// Mock the styles
jest.mock("./styles", () => ({
    __esModule: true,
    default: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
}));

describe("PageSpinner", () => {
    it("matches snapshot", (): void => {
        const { container } = render(<PageSpinner />);
        expect(container).toMatchSnapshot();
    });
});
