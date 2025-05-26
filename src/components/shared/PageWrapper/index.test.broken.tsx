import { render } from "@testing-library/react";
import { useRouter } from "next/router";
import { PageWrapper } from "./index";

jest.mock("next/router", () => ({
    useRouter: jest.fn()
}));

// Mock the useTranslations hook
jest.mock("Contexts/translation", () => ({
    useTranslations: (): {
        setCountry: jest.Mock;
        setLanguage: jest.Mock;
        setTranslations: jest.Mock;
        setBasicTranslations: jest.Mock;
    } => ({
        setCountry: jest.fn(),
        setLanguage: jest.fn(),
        setTranslations: jest.fn(),
        setBasicTranslations: jest.fn()
    })
}));

// Mock the useTranslate function
jest.mock("../Translate", () => ({
    useTranslate:
        () =>
        (text: string): string =>
            text
}));

// Mock the useHasTranslation function
jest.mock("Components/shared/Translate", () => ({
    useTranslate: jest.fn(
        () =>
            (key: string): string =>
                key
    ),
    useHasTranslation: jest.fn(
        () =>
            (key: string): boolean =>
                true
    )
}));

describe("PageWrapper", () => {
    const mockProps = {
        children: <div>Test Content</div>,
        title: "Test Title",
        description: "Test Description",
        background: "white",
        translations: { key: "value" },
        basicTranslations: { basicKey: "basicValue" }
    };

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
            pathname: "/"
        });
    });

    it("renders correctly and matches snapshot", () => {
        const { asFragment } = render(<PageWrapper {...mockProps} />);
        expect(asFragment()).toMatchSnapshot();
    });
});
