import { render, screen } from "@testing-library/react";
import GettingStarted from "./index";

// Mock the necessary dependencies
jest.mock(
    "Components/shared/Translate",
    () =>
        function Translate({ children }: { children: string }): JSX.Element {
            return <span>{children}</span>;
        }
);
jest.mock(
    "next/image",
    () =>
        function Image({
            src,
            alt
        }: {
            src: string;
            alt: string;
        }): JSX.Element {
            return <img src={src} alt={alt} />;
        }
);

describe("GettingStarted", () => {
    it("renders the component with correct structure", () => {
        render(<GettingStarted />);

        expect(
            screen.getByText("create_account_start_by_creating_account")
        ).toBeInTheDocument();
        expect(screen.getAllByRole("img")).toHaveLength(3);
    });

    it("renders all items from gettingStartedConfig", () => {
        render(<GettingStarted />);

        const titles = [
            "create_account_free_easy_to_join",
            "create_account_exclusive_member_pricing",
            "create_account_earn_rewards"
        ];

        const descriptions = [
            "create_account_free_easy_to_join_description",
            "create_account_exclusive_member_pricing_description",
            "create_account_earn_rewards_description"
        ];

        titles.forEach(title => {
            expect(screen.getByText(title)).toBeInTheDocument();
        });

        descriptions.forEach(description => {
            expect(screen.getByText(description)).toBeInTheDocument();
        });
    });

    it("renders images with correct src and alt attributes", () => {
        render(<GettingStarted />);

        const images = screen.getAllByRole("img");
        const expectedSrcs = [
            "/svg/Green-icon.svg",
            "/svg/Blue-icon.svg",
            "/svg/Pink-icon.svg"
        ];
        const expectedAlts = [
            "create_account_free_easy_to_join",
            "create_account_exclusive_member_pricing",
            "create_account_earn_rewards"
        ];

        images.forEach((img, index) => {
            expect(img).toHaveAttribute("src", expectedSrcs[index]);
            expect(img).toHaveAttribute("alt", expectedAlts[index]);
        });
    });
});
