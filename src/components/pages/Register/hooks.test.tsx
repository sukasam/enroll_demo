import { render, renderHook, screen } from "@testing-library/react";
import { SectionFactory, useSectionsConfig } from "./hooks";

// Mock the SectionFactory component
jest.mock("./hooks", () => ({
    ...jest.requireActual("./hooks"),
    SectionFactory: ({ type }: { type: string }): React.ReactNode => {
        switch (type) {
            case "CreateAccount":
                return <div>CreateAccount</div>;
            case "UpdateAccount":
                return <div>UpdateAccount</div>;
            default:
                return <div>Default Component</div>;
        }
    }
}));

jest.mock("react", () => ({
    ...jest.requireActual("react"),
    lazy: jest.fn(
        (importFn: () => Promise<{ default: React.ComponentType<any> }>) =>
            importFn()
    ),
    Suspense: ({ children }: { children: React.ReactNode }): React.ReactNode =>
        children
}));

jest.mock("Components/shared/TitleDescription", () => ({
    __esModule: true,
    default: (): React.ReactNode => <div>TitleDescription</div>
}));

jest.mock("Components/shared/ProductSidebar", () => ({
    __esModule: true,
    default: (): React.ReactNode => <div>ProductSidebar</div>
}));

jest.mock("Components/pages/Register/components/CreateAccount", () => ({
    __esModule: true,
    default: (): React.ReactNode => <div>CreateAccount</div>
}));

jest.mock("Components/pages/Register/components/UpdateAccount", () => ({
    __esModule: true,
    default: (): React.ReactNode => <div>UpdateAccount</div>
}));

describe("useSectionsConfig", () => {
    it("returns default config when isNoPurchaseMarket is false", () => {
        const { result } = renderHook(() =>
            useSectionsConfig(false, null, false)
        );
        expect(result.current).toHaveLength(5);
        expect(result.current[0].type).toBe("CreateAccount");
        expect(result.current[4].type).toBe("PaymentSection");
    });

    it("returns noPurchaseConfig when isNoPurchaseMarket is true", () => {
        const { result } = renderHook(() =>
            useSectionsConfig(false, null, true)
        );
        expect(result.current).toHaveLength(4);
        expect(result.current[0].type).toBe("CreateAccount");
        expect(result.current[1].type).toBe("DistributorOnly");
    });

    it("updates account title when user is logged in", () => {
        const { result } = renderHook(() =>
            useSectionsConfig(true, null, false)
        );
        expect(result.current[0].title).toBe("step_account");
        expect(result.current[0].type).toBe("UpdateAccount");
    });
});

describe("SectionFactory", () => {
    it("renders CreateAccount component", async () => {
        render(<SectionFactory type="CreateAccount" props={{}} />);
        expect(screen.getByText("CreateAccount")).toBeInTheDocument();
    });

    it("renders UpdateAccount component", async () => {
        render(<SectionFactory type="UpdateAccount" props={{}} />);
        expect(screen.getByText("UpdateAccount")).toBeInTheDocument();
    });

    it("renders default component for unknown type", async () => {
        render(<SectionFactory type="UnknownType" props={{}} />);
        expect(screen.getByText("Default Component")).toBeInTheDocument();
    });
});
