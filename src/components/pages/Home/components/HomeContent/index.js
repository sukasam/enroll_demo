/** @jsxImportSource @emotion/react */
import PageLoader from "Components/shared/PageLoader";
import { useTranslate } from "Components/shared/Translate";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";
import { getFullName } from "Services/utils/fullName";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Form from "./Form/index";
import styles from "./styles";

export default function HomeContent({ referrer, refId }) {
    const translate = useTranslate();
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();

    const handleUpgradeClick = e => {
        e.preventDefault();
        mixpanelService.trackEvent(
            MixpanelEvent.HOME_ALREADY_HAVE_ACCOUNT_CLICKED
        );
        router.push("/login");
    };

    return (
        <div css={styles} className="tile main">
            {isLoading && <PageLoader />}
            <div className="wrapper" data-testid="create_opportunity_section">
                <div
                    className="title"
                    data-testid="home_create_your_opportunity"
                >
                    {translate("home_create_your_opportunity")}
                </div>
                {referrer && referrer.items?.[0]?.humanName?.fullName && (
                    <div className="referred-by">
                        {translate("create_account_referred_by")}{" "}
                        {getFullName(referrer.items[0].humanName)}
                    </div>
                )}
                <div
                    className="subtitle"
                    data-testid="home_become_a_distributor"
                >
                    {translate("home_become_a_distributor")}
                </div>
                <p data-testid="home_becoming_unicity_distributor">
                    {translate("home_becoming_unicity_distributor")}
                </p>

                <Form
                    refId={refId}
                    referrer={referrer}
                    setLoading={setLoading}
                />

                <div className="upgrade-text">
                    <Link
                        href="/login"
                        className="upgrade-link"
                        aria-label="Upgrade your account"
                        onClick={handleUpgradeClick}
                    >
                        <div
                            dangerouslySetInnerHTML={{
                                __html: `${translate(
                                    "home_already_have_account"
                                )} 
            <br /> ${translate("home_upgrade_to_distributor", {
                url: "login"
            })}`
                            }}
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}
