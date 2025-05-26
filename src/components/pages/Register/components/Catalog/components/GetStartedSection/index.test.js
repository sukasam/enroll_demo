import { render, screen } from "@testing-library/react";
import GetStartedSection from "./index";

describe("GetStartedSection", () => {
    test("renders with expected elements", () => {
        render(<GetStartedSection />);

        expect(screen.getByTestId("catalog_page_overlay")).toBeInTheDocument();
        expect(
            screen.getByTestId("lets_get_started_title_label")
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("landing_banner_description_label")
        ).toBeInTheDocument();
    });
});
