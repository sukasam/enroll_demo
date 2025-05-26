/** @jsxImportSource @emotion/react */
import { Grid } from "@mui/material";
import { useCountryConfig } from "Constants/countryConfig";
import { useUser } from "Contexts/UserContext";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import RegisterAccordion from "./components/Accordion";
import useLoadProducts from "./components/Catalog/hooks";
import SideBar from "./components/SideBar";
import { SectionFactory, useSectionsConfig } from "./hooks";
import styles from "./styles";

interface Section {
    id: number;
    sidebarContent: JSX.Element | null;
}

export default function RegisterPage(): JSX.Element {
    const { isLoggedIn, activeAccordionSection } = useUser();
    const countryConfig = useCountryConfig();
    const sectionsConfig = useSectionsConfig(
        isLoggedIn,
        activeAccordionSection,
        countryConfig?.isNoPurchaseMarket
    );
    useLoadProducts();
    const router = useRouter();

    useEffect(() => {
        mixpanelService.trackPageView("register");
        router.prefetch("/thank-you");
    }, [router]);

    const memoizedSections = useMemo(
        () =>
            sectionsConfig.map(section => ({
                ...section,
                children: SectionFactory({
                    type: section.type,
                    props: section.props
                })
            })),
        [sectionsConfig]
    );

    const activeSidebarContent = useMemo(
        () =>
            sectionsConfig.find(
                (section: Section) => section.id === activeAccordionSection
            )?.sidebarContent || null,
        [sectionsConfig, activeAccordionSection]
    );

    return (
        <Grid container css={styles} spacing={3}>
            <Grid item md={8} xs={12}>
                <RegisterAccordion sections={memoizedSections} />
            </Grid>
            <Grid className="aside-wrapper" item md={4} xs={12}>
                <SideBar>{activeSidebarContent}</SideBar>
            </Grid>
        </Grid>
    );
}
