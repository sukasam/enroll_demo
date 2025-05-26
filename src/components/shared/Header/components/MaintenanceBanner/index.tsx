import BannerNotificationAlerts from "Components/shared/BannerNotificationAlerts/index";
import { useCountryConfig } from "Constants/countryConfig";
import { Alpha2 } from "Constants/countryConfig/enums";
import {
    ActiveMaintenanceBanner,
    BasicBanner
} from "Services/launchDarkly/types";
import convertDateToCustomFormat from "Services/utils/dateFormatter";
import { useFlags } from "launchdarkly-react-client-sdk";

interface MaintenanceBannerProps {
    currentMarket: Alpha2;
}

export default function MaintenanceBanner(
    props: MaintenanceBannerProps
): JSX.Element | null {
    const { currentMarket } = props;
    const { maintenanceBanner } = useFlags();
    const config = useCountryConfig();

    const rosettaAlterations = (
        rosettaMessage: string,
        activeFlag: BasicBanner
    ): string => {
        // This function can asume the flag is active and has all the nessasary propertys.
        const activeMaintenanceBanner = activeFlag as ActiveMaintenanceBanner;

        const convertedDateTime = convertDateToCustomFormat(
            activeMaintenanceBanner.messageStartTime,
            config?.dateFormat
        );

        const displayMessage = rosettaMessage
            .replace(
                "{{duration}}",
                activeMaintenanceBanner.messageDuration.toString()
            )
            .replace("{{startTime}}", convertedDateTime);
        return displayMessage;
    };

    return (
        <BannerNotificationAlerts
            currentMarket={currentMarket}
            rosettaAlterations={rosettaAlterations}
            bannerFlagLD={maintenanceBanner}
        />
    );
}
