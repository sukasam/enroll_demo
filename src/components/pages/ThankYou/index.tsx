/** @jsxImportSource @emotion/react */
import { Grid } from "@mui/material";
import { useCountryConfig } from "Constants/countryConfig";
import { deleteCookie } from "cookies-next";
import { useEffect } from "react";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import Aside from "./components/Aside";
import Guide from "./components/Guide";
import Summary from "./components/Summary";
import styles from "./styles";

export interface ThankYouProps {
    feedbackComponent?: React.ReactNode;
}

export default function ThankYou({
    feedbackComponent
}: ThankYouProps): JSX.Element {
    const countryConfig = useCountryConfig();

    useEffect(() => {
        mixpanelService.trackPageView("thank-you");
        const handleBeforeUnload = (): void => {
            deleteCookie("refId");
        };
        sessionStorage.setItem("accountForm", "{}");
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    return (
        <Grid container css={styles} spacing={4}>
            <Grid item md={8} xs={12}>
                <Summary />
                {countryConfig?.marketExceptions.showOnboardingGuide ? (
                    <Guide />
                ) : null}
            </Grid>

            <Grid className="aside-wrapper" item md={4} xs={12}>
                <Aside feedbackComponent={feedbackComponent} />
            </Grid>
        </Grid>
    );
}
