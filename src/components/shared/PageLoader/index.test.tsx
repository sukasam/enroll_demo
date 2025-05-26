import { render } from "@testing-library/react";
import PageLoader from "./index";

jest.mock(
    "@mui/material/Box",
    () =>
        function MockBox(props: any): JSX.Element {
            return <div data-testid="mock-box" {...props} />;
        }
);
jest.mock(
    "@mui/material/CircularProgress",
    () =>
        function MockCircularProgress(props: any): JSX.Element {
            return <div data-testid="mock-circular-progress" {...props} />;
        }
);

describe("PageLoader", (): void => {
    it("matches snapshot", (): void => {
        const { container } = render(<PageLoader />);
        expect(container).toMatchSnapshot();
    });
});
