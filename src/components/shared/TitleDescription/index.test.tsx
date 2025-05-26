import { render } from "@testing-library/react";
import { useSectionsConfig } from "Components/pages/Register/hooks";
import { useUser } from "Contexts/UserContext";
import TitleDescription from "./index";

// Mock the necessary hooks
jest.mock("Contexts/UserContext", () => ({
    useUser: jest.fn()
}));

jest.mock("Components/pages/Register/hooks", () => ({
    useSectionsConfig: jest.fn()
}));

jest.mock(
    "./components/Catalog",
    () =>
        function Catalog(): JSX.Element {
            return <div>Catalog Component</div>;
        }
);
jest.mock(
    "./components/DistributorAgreements",
    () =>
        function DistributorAgreements(): JSX.Element {
            return <div>Distributor Agreements Component</div>;
        }
);
jest.mock(
    "./components/Payment",
    () =>
        function Payment(): JSX.Element {
            return <div>Payment Component</div>;
        }
);
jest.mock(
    "./components/DistributorAgreements",
    () =>
        function DistributorAgreements(): JSX.Element {
            return <div>Distributor Agreements Component</div>;
        }
);

jest.mock(
    "./components/Payment",
    () =>
        function Payment(): JSX.Element {
            return <div>Payment Component</div>;
        }
);

jest.mock(
    "./components/ShippingAddress",
    () =>
        function ShippingAddress(): JSX.Element {
            return <div>Shipping Address Component</div>;
        }
);

jest.mock(
    "./components/UpdateAccount",
    () =>
        function UpdateAccount(): JSX.Element {
            return <div>Update Account Component</div>;
        }
);

describe("TitleDescription", () => {
    beforeEach(() => {
        (useUser as jest.Mock).mockReturnValue({
            activeAccordionSection: "someSection"
        });

        (useSectionsConfig as jest.Mock).mockReturnValue([
            { id: "someSection", type: "UpdateAccount" },
            { id: "anotherSection", type: "PackSection" }
        ]);
    });

    it("renders correctly with UpdateAccount sectionType", () => {
        const { asFragment } = render(
            <TitleDescription sectionType="UpdateAccount" />
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders correctly with PackSection sectionType", () => {
        const { asFragment } = render(
            <TitleDescription sectionType="PackSection" />
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders correctly with ShippingSection sectionType", () => {
        const { asFragment } = render(
            <TitleDescription sectionType="ShippingSection" />
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders correctly with DistributorAgreementsSection sectionType", () => {
        const { asFragment } = render(
            <TitleDescription sectionType="DistributorAgreementsSection" />
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders correctly with PaymentSection sectionType", () => {
        const { asFragment } = render(
            <TitleDescription sectionType="PaymentSection" />
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders correctly with an invalid sectionType", () => {
        const { asFragment } = render(
            <TitleDescription sectionType="InvalidSection" />
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
