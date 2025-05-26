import { render, screen } from "@testing-library/react";
import NotReadySection from "./index";

jest.mock("next/router", () => ({
    useRouter: () => ({
        query: { alpha3: "USA" }
    })
}));

jest.mock("next/router", () => ({
    useRouter: () => ({
        query: { alpha3: "USA" }
    })
}));

describe("NotReadySection", () => {
    test("renders with expected elements", () => {
        render(<NotReadySection enrollerId="123" />);

        expect(
            screen.getByTestId("not_ready_to_start_business")
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("not_ready_to_start_business_description")
        ).toBeInTheDocument();
        expect(screen.getByTestId("learn_more")).toBeInTheDocument();
    });
});
