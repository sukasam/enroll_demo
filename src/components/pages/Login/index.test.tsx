import { render } from "@testing-library/react";
import Landing from "./index";

jest.mock("Services/mixpanel/initializeMixPanel", () => ({
    trackPageView: jest.fn()
}));

jest.mock("./components/LoginContent", () => {
    function LoginContent(): JSX.Element {
        return <div data-testid="login-content" />;
    }
    return LoginContent;
});

jest.mock("../Home/components/Aside", () => {
    function Aside(): JSX.Element {
        return <div data-testid="aside" />;
    }
    return Aside;
});

describe("Landing", () => {
    it("renders correctly", () => {
        const { container } = render(<Landing />);
        expect(container).toMatchSnapshot();
    });
});
