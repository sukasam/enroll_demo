/** @jsxImportSource @emotion/react */
import CheckIcon from "@mui/icons-material/Check";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslate } from "Components/shared/Translate";
import { useOrder } from "Contexts/OrderContext";
import { useUser } from "Contexts/UserContext";
import useSectionComplete from "Hooks/useSectionComplete";
import { useEffect } from "react";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";
import applyConditionalStyles from "Styles/utilities/styleUtils";
import styles from "./styles";

type SectionProps = {
    id: number;
    title: string;
    type: string;
    children: JSX.Element | null;
    sidebarContent: JSX.Element | null;
    completedDescription: JSX.Element | null;
};

type RegisterAccordionProps = {
    sections: SectionProps[];
};

function RegisterAccordion({ sections }: RegisterAccordionProps): JSX.Element {
    const { activeAccordionSection, setActiveAccordionSection, isLoggedIn } =
        useUser();
    const t = useTranslate();
    const { isChangeHidden } = useSectionComplete();
    const theme = useTheme();
    const { orderResult } = useOrder();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const isActiveSection = (sectionId: number): boolean =>
        activeAccordionSection === sectionId;

    useEffect(() => {
        if (orderResult?.klarnaRedirectUrl) {
            setActiveAccordionSection(5);
        }
        if (activeAccordionSection === null) {
            setActiveAccordionSection(isLoggedIn ? 2 : 1);
        }
    }, [
        activeAccordionSection,
        isLoggedIn,
        setActiveAccordionSection,
        orderResult?.klarnaRedirectUrl
    ]);

    const trackSectionUpdate = (section: SectionProps): void => {
        const getSectionName = (title: string): string =>
            title.includes("agreements")
                ? "agreements"
                : title.split("step_")[1] || "";

        mixpanelService.trackEvent(
            MixpanelEvent.REGISTER_SECTION_UPDATE_STARTED,
            {
                current_section: getSectionName(
                    sections.find(s => s.id === activeAccordionSection)
                        ?.title || ""
                ),
                clicked_section: getSectionName(section.title)
            }
        );
    };

    const renderSectionIndicator = (
        section: SectionProps,
        index: number
    ): JSX.Element => {
        if (isChangeHidden(section.id)) {
            return (
                <span
                    css={applyConditionalStyles(
                        styles.number(theme),
                        isActiveSection(section.id),
                        styles.activeNumber(theme)
                    )}
                >
                    {index + 1}
                </span>
            );
        }
        return section.type !== "PaymentSection" ? (
            <CheckIcon css={styles.check} />
        ) : (
            <span css={styles.number}>{index + 1}</span>
        );
    };

    const renderChangeButton = (section: SectionProps): JSX.Element | null => {
        if (isChangeHidden(section.id)) return null;

        return (
            <button
                type="button"
                css={styles.changeButton}
                data-testid="step_change"
                onClick={(event): void => {
                    event.stopPropagation();
                    trackSectionUpdate(section);
                    setActiveAccordionSection(section.id);
                }}
            >
                {section.type === "UpdateAccount"
                    ? t("step_update_your_account")
                    : t("step_change")}
            </button>
        );
    };

    return (
        <div css={styles.accordionContainer} data-testid="accordion_container">
            {sections.map((section, index) => (
                <div
                    css={styles.accordionSection}
                    key={section.id}
                    data-testid="accordion_section"
                >
                    <div
                        css={styles.accordionSummary}
                        data-testid="accordion_summary"
                    >
                        <div css={styles.header}>
                            <span css={styles.sectionIndicator}>
                                {renderSectionIndicator(section, index)}
                            </span>
                            <h3 css={styles.title}>{t(section.title)}</h3>
                            {isMobile && renderChangeButton(section)}
                        </div>
                        <div css={styles.completedDescription}>
                            {section.completedDescription}
                        </div>
                        {!isMobile && renderChangeButton(section)}
                    </div>
                    {activeAccordionSection === section.id && (
                        <div
                            css={applyConditionalStyles(
                                styles.details(theme),
                                isActiveSection(section.id),
                                styles.expandedDetails(theme)
                            )}
                        >
                            {section.children}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default RegisterAccordion;
