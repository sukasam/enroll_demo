import { useUser } from "Contexts/UserContext";
import useSectionComplete from "Hooks/useSectionComplete";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";
import { fireEvent, render, screen } from "Shared/testUtils";
import RegisterAccordion from "./index";

// Mock the required hooks and services
jest.mock("Contexts/UserContext");
jest.mock("Hooks/useSectionComplete");
jest.mock("Services/mixpanel/initializeMixPanel");
jest.mock("Components/shared/Translate", () => ({
    useTranslate:
        () =>
        (key: string): string =>
            key
}));

const mockSections = [
    {
        id: 1,
        title: "step_1",
        type: "Section1",
        children: <div>Section 1 Content</div>,
        sidebarContent: null,
        completedDescription: <span>Completed 1</span>
    },
    {
        id: 2,
        title: "step_2",
        type: "Section2",
        children: <div>Section 2 Content</div>,
        sidebarContent: null,
        completedDescription: <span>Completed 2</span>
    },
    {
        id: 3,
        title: "step_3",
        type: "UpdateAccount",
        children: <div>Section 3 Content</div>,
        sidebarContent: null,
        completedDescription: <span>Completed 3</span>
    }
];

describe("RegisterAccordion", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useUser as jest.Mock).mockReturnValue({
            ...useUser(),
            activeAccordionSection: 1,
            isLoggedIn: false
        });
        (useSectionComplete as jest.Mock).mockReturnValue({
            isChangeHidden: jest.fn().mockReturnValue(false)
        });
    });

    it("renders all sections", () => {
        render(<RegisterAccordion sections={mockSections} />);
        expect(screen.getByText("step_1")).toBeInTheDocument();
        expect(screen.getByText("step_2")).toBeInTheDocument();
        expect(screen.getByText("step_3")).toBeInTheDocument();
    });

    it("expands the active section", () => {
        render(<RegisterAccordion sections={mockSections} />);
        expect(screen.getByText("Section 1 Content")).toBeInTheDocument();
        expect(screen.queryByText("Section 2 Content")).not.toBeInTheDocument();
    });

    it("shows completed description for non-active sections", () => {
        render(<RegisterAccordion sections={mockSections} />);
        expect(screen.getByText("Completed 2")).toBeInTheDocument();
        expect(screen.getByText("Completed 3")).toBeInTheDocument();
    });

    it("changes active section when clicking change button", () => {
        render(<RegisterAccordion sections={mockSections} />);
        fireEvent.click(screen.getAllByTestId("step_change")[1]);
        expect(useUser().setActiveAccordionSection).toHaveBeenCalledWith(2);
    });

    it("tracks mixpanel event when changing section", () => {
        render(<RegisterAccordion sections={mockSections} />);
        fireEvent.click(screen.getAllByTestId("step_change")[1]);
        expect(mixpanelService.trackEvent).toHaveBeenCalledWith(
            MixpanelEvent.REGISTER_SECTION_UPDATE_STARTED,
            expect.any(Object)
        );
    });

    it('shows "Update Your Account" text for UpdateAccount section', () => {
        render(<RegisterAccordion sections={mockSections} />);
        expect(
            screen.getByText("step_update_your_account")
        ).toBeInTheDocument();
    });

    it("hides change button when isChangeHidden returns true", () => {
        (useSectionComplete as jest.Mock).mockReturnValue({
            isChangeHidden: jest.fn().mockReturnValue(true)
        });
        render(<RegisterAccordion sections={mockSections} />);
        expect(screen.queryAllByTestId("step_change")).toHaveLength(0);
    });

    it("hides change buttons when isChangeHidden returns true", () => {
        (useSectionComplete as jest.Mock).mockReturnValue({
            isChangeHidden: jest.fn().mockReturnValue(true)
        });
        render(<RegisterAccordion sections={mockSections} />);
        const changeButtons = screen.queryAllByTestId("step_change");

        changeButtons.forEach(button => {
            expect(button).toHaveAttribute("hidden");
        });

        changeButtons.forEach(button => {
            expect(button).not.toBeVisible();
        });
    });

    it("shows change buttons when isChangeHidden returns false", () => {
        (useSectionComplete as jest.Mock).mockReturnValue({
            isChangeHidden: jest.fn().mockReturnValue(false)
        });
        render(<RegisterAccordion sections={mockSections} />);
        const changeButtons = screen.getAllByTestId("step_change");
        expect(changeButtons).toHaveLength(3);
        changeButtons.forEach(button => {
            expect(button).not.toHaveAttribute("hidden");
            expect(button).toBeVisible();
        });
    });

    it("doesn't render change buttons when isChangeHidden returns true", () => {
        (useSectionComplete as jest.Mock).mockReturnValue({
            isChangeHidden: jest.fn().mockReturnValue(true)
        });
        render(<RegisterAccordion sections={mockSections} />);
        const changeButtons = screen.queryAllByTestId("step_change");
        expect(changeButtons).toHaveLength(0);
    });

    it("renders change buttons when isChangeHidden returns false", () => {
        (useSectionComplete as jest.Mock).mockReturnValue({
            isChangeHidden: jest.fn().mockReturnValue(false)
        });
        render(<RegisterAccordion sections={mockSections} />);
        const changeButtons = screen.getAllByTestId("step_change");
        expect(changeButtons).toHaveLength(mockSections.length);
        changeButtons.forEach(button => {
            expect(button).toBeVisible();
        });
    });
});
