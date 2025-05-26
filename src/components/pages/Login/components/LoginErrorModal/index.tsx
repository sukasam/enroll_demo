/** @jsxImportSource @emotion/react */
import { ClickAwayListener } from "@mui/material";
import T, { useTranslate } from "Components/shared/Translate";
import styles from "./styles";

interface LoginErrorModalProps {
    title: string;
    description: string;
    onClose: () => void;
}

export default function LoginErrorModal(
    props: LoginErrorModalProps
): JSX.Element {
    const { title, description, onClose } = props;
    const translate = useTranslate();

    return (
        <div css={styles}>
            <ClickAwayListener onClickAway={onClose}>
                <div className="popup">
                    <div
                        className="popup-title"
                        data-testid="login_error_modal_title"
                    >
                        <T>{title}</T>
                    </div>
                    <div
                        className="description"
                        data-testid="login_error_modal_description"
                        dangerouslySetInnerHTML={{
                            __html: translate(description)
                        }}
                    />
                    <div className="button-container">
                        <div
                            className="cancel"
                            onClick={onClose}
                            role="button"
                            tabIndex={0}
                            data-testid="login_error_modal_cancel"
                            onKeyDown={(e): void => {
                                if (e.key === "Enter" || e.key === "Space") {
                                    onClose();
                                }
                            }}
                        >
                            {translate("home_modal_cancel")}
                        </div>
                    </div>
                </div>
            </ClickAwayListener>
        </div>
    );
}
