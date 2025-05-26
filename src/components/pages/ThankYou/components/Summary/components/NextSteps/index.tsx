/** @jsxImportSource @emotion/react */
import PrimaryButton from "Components/shared/PrimaryButton";
import T from "Components/shared/Translate";
import Link from "next/link";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";
import styles from "./styles";

function NextSteps(): JSX.Element {
    return (
        <div css={styles}>
            <div className="container">
                <div>
                    <span className="number">1</span>
                </div>
                <div className="title">
                    <T>thank_you_complete_distributor_profile</T>
                </div>
                <div className="description">
                    <T>thank_you_go_to_unicity_office</T>
                </div>
            </div>
            <Link
                href="https://office.unicity.com/"
                target="_blank"
                rel="noopener noreferrer"
            >
                <PrimaryButton
                    className="button"
                    onClick={(): void => {
                        mixpanelService.trackEvent(
                            MixpanelEvent.CONGRATS_LOGIN_TO_OFFICE
                        );
                    }}
                >
                    <T>thank_you_button_login_unicity_office</T>
                </PrimaryButton>
            </Link>
        </div>
    );
}

export default NextSteps;
