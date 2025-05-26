import { render } from "@testing-library/react";
import CurrencyFormatter from "./index";

// Mock the dependencies
jest.mock(
    "Components/shared/Spinner",
    () =>
        function MockSpinner(): JSX.Element {
            return <div data-testid="spinner">Spinner</div>;
        }
);

jest.mock(
    "Components/shared/Translate",
    () =>
        function MockTranslate({
            children
        }: {
            children: string;
        }): JSX.Element {
            return <span>{children}</span>;
        }
);

jest.mock("Constants/countryConfig", (): any => ({
    useCountryConfig: (): { currency: string } => ({ currency: "USD" })
}));

jest.mock("Contexts/translation", (): any => ({
    useTranslations: (): { country: string; language: string } => ({
        country: "US",
        language: "en"
    })
}));

describe("CurrencyFormatter", () => {
    it("should render spinner when children is undefined", () => {
        const { container } = render(
            <CurrencyFormatter>{undefined}</CurrencyFormatter>
        );
        expect(container.firstChild).toMatchSnapshot();
    });

    it("should render spinner when children is null", () => {
        const { container } = render(
            <CurrencyFormatter>{null}</CurrencyFormatter>
        );
        expect(container.firstChild).toMatchSnapshot();
    });

    it("should render spinner when children is NaN", () => {
        const { container } = render(
            <CurrencyFormatter>Not a number</CurrencyFormatter>
        );
        expect(container.firstChild).toMatchSnapshot();
    });

    it("should render 'Free' when children is 0 and allowFree is true", () => {
        const { container } = render(
            <CurrencyFormatter allowFree>{0}</CurrencyFormatter>
        );
        expect(container.firstChild).toMatchSnapshot();
    });

    it("should render formatted currency", () => {
        const { container } = render(
            <CurrencyFormatter>{1000}</CurrencyFormatter>
        );
        expect(container.firstChild).toMatchSnapshot();
    });

    it("should render formatted currency with custom currency", () => {
        const { container } = render(
            <CurrencyFormatter currency="EUR">{1000}</CurrencyFormatter>
        );
        expect(container.firstChild).toMatchSnapshot();
    });
});
