/** @jsxImportSource @emotion/react */
import { Grid } from "@mui/material";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import { useEffect } from "react";
import Aside from "../Home/components/Aside";
import LoginContent from "./components/LoginContent";
import styles from "./styles";

export default function Landing(): JSX.Element {
    useEffect(() => {
        mixpanelService.trackPageView("login");
    }, []);

    return (
        <Grid container css={styles} spacing={4}>
            <Grid item md={8} xs={12}>
                <LoginContent />
            </Grid>
            <Grid
                className="aside-wrapper"
                data-testid="starting_business_just_become_easier_section"
                item
                md={4}
                xs={12}
            >
                <Aside />
            </Grid>
        </Grid>
    );
}
