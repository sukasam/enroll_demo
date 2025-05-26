/** @jsxImportSource @emotion/react */

import { Grid } from "@mui/material";
import T from "Components/shared/Translate";
import styles from "./styles";

export default function GetStartedSection(): JSX.Element {
    return (
        <div css={styles}>
            <div className="overlay" data-testid="catalog_page_overlay" />
            <Grid className="content" container>
                <Grid container>
                    <Grid className="content-container" item md={6} xs={12}>
                        <h1
                            className="title1"
                            data-testid="lets_get_started_title_label"
                        >
                            <T>lets_get_started</T>
                        </h1>
                        <p
                            className="description"
                            data-testid="landing_banner_description_label"
                        >
                            <T>landing_banner_description</T>
                        </p>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}
