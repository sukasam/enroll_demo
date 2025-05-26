import { render, screen } from "@testing-library/react";
import Aside from "./index";

jest.mock("Components/shared/Translate", () => ({
    useTranslate: () => jest.fn(key => key)
}));

describe("Aside", () => {
    it("renders all expected elements", () => {
        render(<Aside />);

        expect(screen.getByTestId("home_page_overlay")).toBeInTheDocument();
        expect(
            screen.getByTestId(
                "right_column_starting_your_business_just_got_easier"
            )
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("right_column_your_business_your_way")
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("right_column_unicity_help_become_leader")
        ).toBeInTheDocument();

        const listItems = [
            "right_column_wholesale_product_pricing",
            "right_column_earn_commissions_product_sales",
            "right_column_build_your_business_your_way",
            "right_column_growth_incentives",
            "right_column_training_education",
            "right_column_business_building_tools",
            "right_column_networking_opportunities",
            "right_column_be_part_of_community"
        ];
        listItems.forEach(item => {
            expect(screen.getByTestId(item)).toBeInTheDocument();
        });

        const learnMoreLink = screen.getByTestId("right_column_learn_more");
        expect(learnMoreLink).toBeInTheDocument();
        expect(learnMoreLink).toHaveAttribute("target", "_blank");
        expect(learnMoreLink).toHaveAttribute("rel", "noreferrer noopener");
    });
});
