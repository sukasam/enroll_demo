import "@testing-library/jest-dom";
import { getCountries } from "Constants/countryConfig";
import { useTranslations } from "Contexts/translation";
import { render, screen } from "Shared/testUtils";
import CountryDisplay from "./index";

jest.mock("Contexts/translation", () => ({
    useTranslations: jest.fn()
}));

jest.mock("Constants/countryConfig", () => ({
    getCountries: jest.fn()
}));

jest.mock(
    "react-world-flags",
    () =>
        function MockFlag({ code }: { code: string }): JSX.Element {
            return <div data-testid="flag" data-code={code} />;
        }
);

describe("CountryDisplay", () => {
    const mockCountries = [
        { name: "United States", alpha2: "US", isSupported: true },
        { name: "Canada", alpha2: "CA", isSupported: true },
        { name: "United Kingdom", alpha2: "GB", redirect: true },
        { name: "France", alpha2: "FR", isSupported: false }
    ];

    beforeEach(() => {
        (useTranslations as jest.Mock).mockReturnValue({ country: "US" });
        (getCountries as jest.Mock).mockReturnValue(mockCountries);
    });

    it("renders without crashing", () => {
        render(<CountryDisplay />);
        expect(screen.getByTestId("flag")).toBeInTheDocument();
    });

    it("displays the correct country name", () => {
        render(<CountryDisplay />);
        expect(screen.getByText("United States")).toBeInTheDocument();
    });

    it("passes the correct country code to the Flag component", () => {
        render(<CountryDisplay />);
        const flag = screen.getByTestId("flag");
        expect(flag).toHaveAttribute("data-code", "US");
    });

    it("filters and sorts countries correctly", () => {
        (useTranslations as jest.Mock).mockReturnValue({ country: "GB" });
        render(<CountryDisplay />);
        expect(screen.getByText("United Kingdom")).toBeInTheDocument();
    });

    it("handles unsupported countries", () => {
        (useTranslations as jest.Mock).mockReturnValue({ country: "FR" });
        render(<CountryDisplay />);
        expect(screen.queryByText("France")).not.toBeInTheDocument();
    });
});
