/** @jsxImportSource @emotion/react */

import { ClickAwayListener } from "@mui/material";
import PrimaryButton from "Components/shared/PrimaryButton";
import T from "Components/shared/Translate";
import { getCountryConfig } from "Constants/countryConfig";
import { Alpha2 } from "Constants/countryConfig/enums";
import { EVENTS, sendEvent } from "Services/googleAnalytics";
import Image from "next/image";
import styles from "./styles";

interface RedirectPopupProps {
    path: string;
    selectedCountry: Alpha2;
    onClose: () => void;
}

export default function RedirectPopup(props: RedirectPopupProps): JSX.Element {
    const { path, selectedCountry, onClose } = props;

    const countryConfig = getCountryConfig(selectedCountry, false);

    return (
        <div css={styles}>
            <ClickAwayListener onClickAway={onClose}>
                <div className="popup">
                    <Image
                        alt=""
                        src="/svg/hang-tight.svg"
                        width={120}
                        height={120}
                        quality={85}
                    />
                    <div className="popup-title">
                        <T>home_modal_hang_tight</T>
                    </div>
                    <div
                        className="description"
                        data-testid="home_modal_hang_tight_description"
                    >
                        <T
                            variables={{
                                country_name: countryConfig?.name
                            }}
                        >
                            home_modal_hang_tight_ description
                        </T>
                    </div>
                    <div className="button-container">
                        <PrimaryButton
                            onClick={(): void => {
                                sendEvent(EVENTS.HOME_BUTTON_COUNTRY_REDIRECT, {
                                    country: selectedCountry
                                });

                                window.location.href = path;
                            }}
                            className="continue"
                            data-href={path}
                            data-testid="home_modal_lets_go_btn"
                        >
                            <T>home_modal_lets_go_btn</T>
                        </PrimaryButton>
                        <div
                            className="cancel"
                            onClick={onClose}
                            role="button"
                            tabIndex={0}
                            data-testid="home_modal_cancel"
                            onKeyDown={(e): void => {
                                if (e.key === "Enter" || e.key === "Space") {
                                    onClose();
                                }
                            }}
                        >
                            <T>home_modal_cancel</T>
                        </div>
                    </div>
                </div>
            </ClickAwayListener>
        </div>
    );
}
