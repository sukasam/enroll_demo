/* eslint-disable jsx-a11y/alt-text */
import { render } from "@testing-library/react";
import LocalImage from "./index";

// Mock next/image
jest.mock("next/image", () => ({
    __esModule: true,
    default: props => <img {...props} data-testid="next-image" />
}));

const originalLocation = window.location;
delete window.location;
window.location = { origin: "https://example.com" };

describe("LocalImage", () => {
    afterAll(() => {
        window.location = originalLocation;
    });

    it("renders without error", () => {
        const { getByAltText } = render(
            <LocalImage
                src="/test-image.png"
                alt="Test Image"
                width={100}
                height={100}
                layout="fill"
            />
        );
        const image = getByAltText("Test Image");
        expect(image).toBeInTheDocument();
    });

    it("handles undefined src prop", () => {
        const { getByTestId } = render(
            <LocalImage alt="Test Image" width={100} height={100} />
        );
        const image = getByTestId("next-image");
        expect(image).toHaveAttribute("src", "");
    });

    it("passes through additional props", () => {
        const { getByTestId } = render(
            <LocalImage
                src="/test-image.png"
                alt="Test Image"
                width={100}
                height={100}
                layout="fill"
                customProp="test"
            />
        );
        const image = getByTestId("next-image");
        expect(image).toHaveAttribute("customProp", "test");
    });
});
