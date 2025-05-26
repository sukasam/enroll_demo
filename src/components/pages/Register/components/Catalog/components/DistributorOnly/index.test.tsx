import { render } from "@testing-library/react";
import { TranslationContextType } from "Contexts/translation";
import React from "react";
import DistributorOnly from "./index";

// Mock the necessary dependencies
jest.mock(
    "Components/shared/CurrencyFormatter",
    () =>
        function MockCurrencyFormatter({
            children
        }: {
            children: React.ReactNode;
        }): JSX.Element {
            return <span>{children}</span>;
        }
);

jest.mock("Contexts/UserContext", () => ({
    ...jest.requireActual("Contexts/UserContext"),
    useUser: (): { goToNextSection: jest.Mock } => ({
        goToNextSection: jest.fn()
    }),
    UserProvider: ({ children }: { children: any }): JSX.Element => children
}));

// Mock the translation context
const mockTranslationContext: TranslationContextType = {
    translations: {
        catalog_distributor_only: "Distributor Only",
        catalog_payment_distributor_only: "Payment Distributor Only",
        catalog_distributor_only_description: "Description",
        button_distributor_only: "Continue"
    },
    basicTranslations: {},
    country: "US",
    language: "en",
    setTranslations: jest.fn(),
    setBasicTranslations: jest.fn(),
    setCountry: jest.fn(),
    setLanguage: jest.fn(),
    fetchTranslations: jest.fn()
};

jest.mock("Contexts/translation", () => ({
    useTranslations: (): TranslationContextType => mockTranslationContext,
    TranslationProvider: ({ children }: { children: React.ReactNode }): any =>
        children
}));

describe("DistributorOnly", () => {
    it("renders correctly", () => {
        const { asFragment } = render(<DistributorOnly />);
        expect(asFragment()).toMatchSnapshot();
    });
});
