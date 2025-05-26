import { useCountryConfig } from "Constants/countryConfig";
import { useProducts } from "Contexts/ProductContext";
import { render } from "Shared/testUtils";
import Catalog from "./Catalog";

// Mock the necessary hooks and components
jest.mock("Contexts/ProductContext", () => ({
    useProducts: jest.fn()
}));

jest.mock("Constants/countryConfig", () => ({
    useCountryConfig: jest.fn()
}));

jest.mock(
    "Components/shared/Translate",
    () =>
        function Translate({
            children
        }: {
            children: React.ReactNode;
        }): JSX.Element {
            return <span>{children}</span>;
        }
);

describe("Catalog", () => {
    beforeEach(() => {
        (useProducts as jest.Mock).mockReturnValue({
            shoppingCart: []
        });

        (useCountryConfig as jest.Mock).mockReturnValue({});
    });

    it("renders correctly with selected UFG product", () => {
        (useProducts as jest.Mock).mockReturnValue({
            shoppingCart: [
                {
                    options: {
                        unimate_flavour: { title: "Lemon" },
                        balance_pack: { title: "Orange" }
                    }
                }
            ]
        });

        const { asFragment } = render(<Catalog />);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders correctly with selected digital product", () => {
        (useProducts as jest.Mock).mockReturnValue({
            shoppingCart: [
                {
                    isDigital: true
                }
            ]
        });

        const { asFragment } = render(<Catalog />);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders correctly with no purchase market", () => {
        (useCountryConfig as jest.Mock).mockReturnValue({
            isNoPurchaseMarket: true
        });

        const { asFragment } = render(<Catalog />);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders null when no products are selected and not in no purchase market", () => {
        const { asFragment } = render(<Catalog />);
        expect(asFragment()).toMatchSnapshot();
    });
});
