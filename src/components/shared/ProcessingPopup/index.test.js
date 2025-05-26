import { render, screen } from "@testing-library/react";
import * as TranslateModule from "Components/shared/Translate";
import * as CountryConfigModule from "Constants/countryConfig";
import ProcessingPopup from "./index";

// Mock the modules
jest.mock("Components/shared/Translate", () => ({
    __esModule: true,
    default: ({ children }) => children,
    useTranslate: jest.fn()
}));

jest.mock("Constants/countryConfig", () => ({
    useCountryConfig: jest.fn()
}));

// Mock the styles import
jest.mock("./styles", () => ({}));

describe("ProcessingPopup", () => {
    const mockTranslate = jest.fn(key => `Translated ${key}`);

    beforeEach(() => {
        jest.spyOn(TranslateModule, "useTranslate").mockReturnValue(
            mockTranslate
        );
    });

    it("renders correctly for purchase market", () => {
        jest.spyOn(CountryConfigModule, "useCountryConfig").mockReturnValue({
            isNoPurchaseMarket: false
        });

        render(<ProcessingPopup />);

        expect(screen.getByText("payment_processing")).toBeInTheDocument();
        expect(
            screen.getByText("Translated payment_processing_description")
        ).toBeInTheDocument();
    });

    it("renders correctly for no-purchase market", () => {
        jest.spyOn(CountryConfigModule, "useCountryConfig").mockReturnValue({
            isNoPurchaseMarket: true
        });

        render(<ProcessingPopup />);

        expect(screen.getByText("upgrade_processing")).toBeInTheDocument();
        expect(
            screen.getByText("Translated upgrade_processing_description")
        ).toBeInTheDocument();
    });

    it("renders loader elements", () => {
        render(<ProcessingPopup />);

        expect(screen.getByTestId("loader")).toBeInTheDocument();
        expect(screen.getAllByTestId("outside-line")).toHaveLength(2);
        expect(screen.getByTestId("inside-line")).toBeInTheDocument();
    });
});
