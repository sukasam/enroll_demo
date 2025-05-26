import { StyledModalProps } from "../index";

function MockStyledModal({ children }: StyledModalProps): JSX.Element {
    return <div data-testid="styled-modal">{children}</div>;
}

MockStyledModal.displayName = "MockStyledModal";

export default MockStyledModal;
