import { render } from "@testing-library/react";
import { useOrder } from "Contexts/OrderContext";
import { useTranslations } from "Contexts/translation";
import useSectionComplete from "Hooks/useSectionComplete";
import DistributorAgreementsHooks from "./DistributorAgreements";

// Mock the necessary hooks and components
jest.mock("Contexts/OrderContext", () => ({
    useOrder: jest.fn()
}));

jest.mock("Contexts/translation", () => ({
    useTranslations: jest.fn()
}));

jest.mock("Hooks/useSectionComplete", () => jest.fn());

jest.mock(
    "Components/shared/Translate",
    () =>
        function Translate({
            children
        }: {
            children: React.ReactNode;
        }): React.ReactNode {
            return <span>{children}</span>;
        }
);

describe("DistributorAgreementsHooks", () => {
    beforeEach(() => {
        (useOrder as jest.Mock).mockReturnValue({
            signatureDateTimeStamp: null
        });

        (useTranslations as jest.Mock).mockReturnValue({
            country: "US",
            language: "en"
        });

        (useSectionComplete as jest.Mock).mockReturnValue({
            isDistributorAgreementComplete: false
        });

        global.Intl.DateTimeFormat = jest.fn().mockImplementation(() => ({
            format: (): string => "12/19/2023, 7:22 PM"
        })) as unknown as typeof Intl.DateTimeFormat;
        global.Intl.DateTimeFormat.supportedLocalesOf = jest
            .fn()
            .mockReturnValue(true);
    });

    it("renders correctly when agreement is not complete", () => {
        const { asFragment } = render(<DistributorAgreementsHooks />);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders correctly when agreement is complete and has a valid signature date", () => {
        (useOrder as jest.Mock).mockReturnValue({
            signatureDateTimeStamp: "2023-12-19T19:22:00Z"
        });

        (useSectionComplete as jest.Mock).mockReturnValue({
            isDistributorAgreementComplete: true
        });

        const { asFragment } = render(<DistributorAgreementsHooks />);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders null when there is no signature date", () => {
        (useOrder as jest.Mock).mockReturnValue({
            signatureDateTimeStamp: null
        });

        (useSectionComplete as jest.Mock).mockReturnValue({
            isDistributorAgreementComplete: true
        });

        const { asFragment } = render(<DistributorAgreementsHooks />);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders null when agreement is not complete", () => {
        (useOrder as jest.Mock).mockReturnValue({
            signatureDateTimeStamp: "2023-12-19T19:22:00Z"
        });

        (useSectionComplete as jest.Mock).mockReturnValue({
            isDistributorAgreementComplete: false
        });

        const { asFragment } = render(<DistributorAgreementsHooks />);
        expect(asFragment()).toMatchSnapshot();
    });
});
