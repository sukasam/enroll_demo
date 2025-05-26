/** @jsxImportSource @emotion/react */

import { ClickAwayListener } from "@mui/material";
import Footer from "Components/shared/Footer";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import styles, { fullPageStyles } from "./styles";

export type StyledModalProps = {
    isOpen: boolean;
    setIsOpen?: (isOpen: boolean) => void;
    children: ReactNode;
    handleClose?: () => void;
    title?: string | null;
    fullPage?: boolean;
    dataTest?: string | null;
};

export default function StyledModal({
    isOpen,
    setIsOpen,
    children,
    handleClose,
    title = null,
    fullPage = false,
    dataTest = null
}: StyledModalProps): JSX.Element {
    const [windowWidth, setWindowWidth] = useState<number>(0);

    const _handleClose = (): void => {
        if (handleClose) {
            handleClose();
            return;
        }
        if (setIsOpen) setIsOpen(false);
    };

    useEffect(() => {
        const updateWindowSize = (): void => {
            setWindowWidth(window.innerWidth);
            // setWindowHeight(document.querySelector("body")?.offsetHeight ?? 0);
        };
        updateWindowSize();

        window.addEventListener("resize", updateWindowSize);

        return (): void => {
            window.removeEventListener("resize", updateWindowSize);
        };
    }, []);

    const showFullPage = fullPage && windowWidth < 600;

    return (
        <div>
            {isOpen && (
                <div css={showFullPage ? fullPageStyles : styles}>
                    {showFullPage ? (
                        <>
                            <header>
                                <Image
                                    alt="Unicity Logo"
                                    height={16}
                                    src="/unicity.svg"
                                    width={97}
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        objectFit: "contain"
                                    }}
                                />
                                <Image
                                    alt="Close modal button"
                                    className="close"
                                    data-testid="close_modal"
                                    height="16"
                                    onClick={_handleClose}
                                    src="/svg/close.svg"
                                    width="16"
                                />
                            </header>
                            <div className="wrapper">
                                <div
                                    className="container"
                                    data-testid="modal_container"
                                >
                                    {title && (
                                        <div className="title">{title}</div>
                                    )}
                                    {children}
                                </div>
                                <Footer />
                            </div>
                        </>
                    ) : (
                        <ClickAwayListener onClickAway={_handleClose}>
                            <div className="modal" data-test={dataTest}>
                                <div
                                    aria-label="Close Modal"
                                    className="close"
                                    data-testid="close_modal"
                                    onClick={_handleClose}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e): void => {
                                        if (
                                            e.key === "Enter" ||
                                            e.key === "Space"
                                        ) {
                                            _handleClose();
                                        }
                                    }}
                                >
                                    <Image
                                        alt="Close modal button"
                                        height="10"
                                        onClick={_handleClose}
                                        src="/svg/close.svg"
                                        width="10"
                                    />
                                </div>
                                <div className="title">{title}</div>
                                <div className="content">{children}</div>
                            </div>
                        </ClickAwayListener>
                    )}
                </div>
            )}
        </div>
    );
}
