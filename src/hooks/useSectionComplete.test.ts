import { renderHook } from "@testing-library/react";
import { useSectionsConfig } from "Components/pages/Register/hooks";
import { useCountryConfig } from "Constants/countryConfig";
import { useOrder } from "Contexts/OrderContext";
import { useProducts } from "Contexts/ProductContext";
import { useUser } from "Contexts/UserContext";
import useSectionComplete from "./useSectionComplete";

// Mock the imported hooks
jest.mock("Contexts/UserContext");
jest.mock("Contexts/ProductContext");
jest.mock("Contexts/OrderContext");
jest.mock("Constants/countryConfig");
jest.mock("Components/pages/Register/hooks");

describe("useSectionComplete", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useProducts as jest.Mock).mockReturnValue({ shoppingCart: [] });
        (useOrder as jest.Mock).mockReturnValue({
            signedTerms: false,
            userSignature: "",
            signatureDateTimeStamp: "",
            selectedPaymentMethod: "",
            shipToAddress: null
        });
        (useUser as jest.Mock).mockReturnValue({
            ...useUser(),
            isLoggedIn: false,
            userData: null,
            activeAccordionSection: 1,
            mainAddress: null
        });
        (useCountryConfig as jest.Mock).mockReturnValue({
            isNoPurchaseMarket: false,
            marketExceptions: { hiddenShippingProvince: false }
        });
        (useSectionsConfig as jest.Mock).mockReturnValue([]);
    });

    it("should return correct isAccountCreationComplete value", () => {
        (useUser as jest.Mock).mockReturnValue({
            isLoggedIn: true,
            userData: {
                email: "test@example.com",
                firstName: "John",
                lastName: "Doe"
            }
        });

        const { result } = renderHook(() => useSectionComplete());

        expect(result.current.isAccountCreationComplete).toBe(true);
    });

    it("should return false for isAccountCreationComplete when not logged in", () => {
        (useUser as jest.Mock).mockReturnValue({
            isLoggedIn: false,
            userData: null
        });

        const { result } = renderHook(() => useSectionComplete());

        expect(result.current.isAccountCreationComplete).toBe(false);
    });

    it("should return correct isCatalogComplete value for physical product", () => {
        (useProducts as jest.Mock).mockReturnValue({
            shoppingCart: [
                {
                    options: {
                        unimate_flavour: { title: "Lemon" },
                        balance_pack: { title: "Mixed" }
                    }
                }
            ]
        });
        (useCountryConfig as jest.Mock).mockReturnValue({
            isNoPurchaseMarket: false,
            marketExceptions: { hiddenShippingProvince: false }
        });

        const { result } = renderHook(() => useSectionComplete());

        expect(result.current.isCatalogComplete).toBe(true);
    });

    it("should return correct isShippingComplete value for purchase market with all fields", () => {
        (useOrder as jest.Mock).mockReturnValue({
            shipToAddress: {
                address1: "123 Main St",
                city: "Anytown",
                state: "CA",
                zip: "12345",
                country: "USA"
            }
        });
        (useCountryConfig as jest.Mock).mockReturnValue({
            isNoPurchaseMarket: false,
            marketExceptions: { hiddenShippingProvince: false }
        });

        const { result } = renderHook(() => useSectionComplete());

        expect(result.current.isShippingComplete).toBe(true);
    });

    it("should return false for isShippingComplete when state is missing in purchase market", () => {
        (useOrder as jest.Mock).mockReturnValue({
            shipToAddress: {
                address1: "123 Main St",
                city: "Anytown",
                zip: "12345",
                country: "USA"
            }
        });
        (useCountryConfig as jest.Mock).mockReturnValue({
            isNoPurchaseMarket: false,
            marketExceptions: { hiddenShippingProvince: false }
        });

        const { result } = renderHook(() => useSectionComplete());

        expect(result.current.isShippingComplete).toBe(false);
    });

    it("should return true for isShippingComplete when state is missing but hiddenShippingProvince is true", () => {
        (useOrder as jest.Mock).mockReturnValue({
            shipToAddress: {
                address1: "123 Main St",
                city: "Anytown",
                zip: "12345",
                country: "USA"
            }
        });
        (useCountryConfig as jest.Mock).mockReturnValue({
            isNoPurchaseMarket: false,
            marketExceptions: { hiddenShippingProvince: true }
        });

        const { result } = renderHook(() => useSectionComplete());

        expect(result.current.isShippingComplete).toBe(true);
    });

    it("should return correct isShippingComplete value for no-purchase market", () => {
        (useUser as jest.Mock).mockReturnValue({
            mainAddress: {
                address1: "123 Main St",
                city: "Anytown",
                state: "CA",
                zip: "12345",
                country: "USA"
            }
        });
        (useCountryConfig as jest.Mock).mockReturnValue({
            isNoPurchaseMarket: true,
            marketExceptions: { hiddenShippingProvince: false }
        });

        const { result } = renderHook(() => useSectionComplete());

        expect(result.current.isShippingComplete).toBe(true);
    });

    it("should return false for isShippingComplete when required field is missing", () => {
        (useOrder as jest.Mock).mockReturnValue({
            shipToAddress: {
                address1: "123 Main St",
                city: "Anytown",
                state: "CA",
                country: "USA"
                // zip is missing
            }
        });
        (useCountryConfig as jest.Mock).mockReturnValue({
            isNoPurchaseMarket: false,
            marketExceptions: { hiddenShippingProvince: false }
        });

        const { result } = renderHook(() => useSectionComplete());

        expect(result.current.isShippingComplete).toBe(false);
    });

    it("should return correct isDistributorAgreementComplete value", () => {
        (useOrder as jest.Mock).mockReturnValue({
            signedTerms: true,
            userSignature: "John Doe",
            signatureDateTimeStamp: "2023-04-20T12:00:00Z"
        });

        const { result } = renderHook(() => useSectionComplete());

        expect(result.current.isDistributorAgreementComplete).toBe(true);
    });
});
