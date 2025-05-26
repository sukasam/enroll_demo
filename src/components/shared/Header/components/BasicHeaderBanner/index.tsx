import BannerNotificationAlerts from "Components/shared/BannerNotificationAlerts/index";
import { Alpha2 } from "Constants/countryConfig/enums";
import { useFlags } from "launchdarkly-react-client-sdk";
import { useRouter } from "next/router";

interface BasicHeaderBannerProps {
    currentMarket: Alpha2;
    flagNameLD: string;
}

export default function BasicHeaderBanner(
    props: BasicHeaderBannerProps
): JSX.Element | null {
    const { currentMarket, flagNameLD } = props;
    const flags = useFlags();
    const flagValue = flags[flagNameLD]; // Access the flag by its string name
    const router = useRouter();

    if (router.pathname.includes("/home") && flagNameLD === "outOfStock") {
        return null; // Do not render the banner on the Home page
    }

    return (
        <BannerNotificationAlerts
            currentMarket={currentMarket}
            rosettaAlterations={(displayMessage: string): string =>
                displayMessage
            }
            bannerFlagLD={flagValue}
        />
    );
}
