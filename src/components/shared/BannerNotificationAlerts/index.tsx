/** @jsxImportSource @emotion/react */
import { useTranslate } from "Components/shared/Translate";
import { Alpha2 } from "Constants/countryConfig/enums";
import { BasicBanner, EmptyBasicBanner } from "Services/launchDarkly/types";
import isActiveBanner from "Services/launchDarkly/utiles";
import styles from "./styles";

interface BannerProps {
    currentMarket: Alpha2;
    rosettaAlterations: (message: string, activeFlag: BasicBanner) => string;
    bannerFlagLD: EmptyBasicBanner;
    children?: JSX.Element | never;
}

export default function BannerNotificationAlerts(
    props: BannerProps
): JSX.Element | null {
    const { currentMarket, rosettaAlterations, bannerFlagLD, children } = props;
    const translate = useTranslate();

    if (!isActiveBanner(bannerFlagLD)) {
        return null;
    }
    const activeBannerFlagLD = bannerFlagLD as BasicBanner;

    if (!activeBannerFlagLD.markets.includes(currentMarket)) {
        return null;
    }

    let displayMessage = translate(activeBannerFlagLD.rosettaTag);
    displayMessage = rosettaAlterations(displayMessage, activeBannerFlagLD);

    return (
        <div css={styles}>
            <div className="container">
                <div className="banner">
                    <div
                        className="message"
                        dangerouslySetInnerHTML={{
                            __html: displayMessage
                        }}
                    />
                    <div className="children">{children}</div>
                </div>
            </div>
        </div>
    );
}
