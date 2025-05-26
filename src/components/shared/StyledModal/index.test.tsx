import { fireEvent, render, screen } from "@testing-library/react";
import StyledModal from "./index";

// Mock the next/image component
jest.mock("next/image", () => ({
    __esModule: true,
    default: (props: any): JSX.Element => <img alt="" {...props} />
}));

describe("StyledModal", () => {
    const mockSetIsOpen = jest.fn();
    const mockHandleClose = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders nothing when isOpen is false", () => {
        render(<StyledModal isOpen={false}>{null}</StyledModal>);
        expect(screen.queryByTestId("modal_container")).not.toBeInTheDocument();
    });

    it("renders content when isOpen is true", () => {
        render(<StyledModal isOpen>Test Content</StyledModal>);
        expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("calls setIsOpen when close button is clicked", () => {
        render(
            <StyledModal isOpen setIsOpen={mockSetIsOpen}>
                Test Content
            </StyledModal>
        );
        fireEvent.click(screen.getByTestId("close_modal"));
        expect(mockSetIsOpen).toHaveBeenCalledWith(false);
    });

    it("calls handleClose when provided and close button is clicked", () => {
        render(
            <StyledModal isOpen handleClose={mockHandleClose}>
                Test Content
            </StyledModal>
        );
        fireEvent.click(screen.getByTestId("close_modal"));
        expect(mockHandleClose).toHaveBeenCalled();
    });

    it("renders title when provided", () => {
        render(
            <StyledModal isOpen title="Modal Title">
                Test Content
            </StyledModal>
        );
        expect(screen.getByText("Modal Title")).toBeInTheDocument();
    });

    it("renders in full page mode on small screens", () => {
        global.innerWidth = 500;
        global.dispatchEvent(new Event("resize"));

        render(
            <StyledModal isOpen fullPage>
                Test Content
            </StyledModal>
        );
        expect(screen.getByAltText("Unicity Logo")).toBeInTheDocument();
    });
});
