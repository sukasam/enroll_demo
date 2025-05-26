/** @jsxImportSource @emotion/react */
import { Grid } from "@mui/material";
import { useHasTranslation, useTranslate } from "Components/shared/Translate";
import footerConfig from "Constants/footerConfig";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";
import clsx from "Services/utils/clsx";
import BranchName from "./components/BranchName";
import styles from "./styles";

const ANALYTICS_MAPPING = {
    footer_contact_us_link: "contact",
    footer_our_company_link: "our_company",
    footer_science_link: "science",
    footer_unicity_blog_link: "unicity_blog",
    footer_twitter_link: "social_x",
    footer_facebook_link: "social_facebook",
    footer_pintrest_link: "social_pinterest",
    footer_instagram_link: "social_instagram",
    footer_youtube_link: "social_youtube"
};

const trackLinkClick = key => {
    const actionType = ANALYTICS_MAPPING[key];
    if (actionType) {
        try {
            mixpanelService.trackEvent(MixpanelEvent.FOOTER_LINK_CLICKED, {
                action: actionType
            });
        } catch (error) {
            console.error("Failed to track footer link click:", error);
        }
    }
};

const Footer = () => {
    const translate = useTranslate();
    const hasTranslation = useHasTranslation();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const dynamicContent = isClient ? (
        <footer className="footer" css={styles}>
            <div className="top-wrapper">
                <div className="top">
                    <div className="social">
                        <Image
                            alt="Unicity"
                            className="logo"
                            src="/svg/logo.svg"
                            width={140}
                            height={25}
                            data-testid="Unicity Logo"
                        />
                        <div className="social-links">
                            {footerConfig.socialLinks.map(link =>
                                hasTranslation(link.key) ? (
                                    <Link
                                        key={link.key}
                                        className="social-link"
                                        href={translate(link.key)}
                                        rel="noreferrer"
                                        target="_blank"
                                        data-testid={link.key}
                                        onClick={() => trackLinkClick(link.key)}
                                    >
                                        <Image
                                            alt={translate(link.alt)}
                                            src={link.icon}
                                            width={24}
                                            height={24}
                                        />
                                    </Link>
                                ) : null
                            )}
                        </div>
                    </div>

                    <div className="sections">
                        {footerConfig.sections.map(section => (
                            <div className="section" key={section.title}>
                                <p
                                    className="bolder"
                                    data-testid={section.title}
                                >
                                    {translate(section.title)}
                                </p>
                                {section.links.map(link =>
                                    hasTranslation(link.key) ? (
                                        <Link
                                            key={link.key}
                                            className="links"
                                            href={translate(link.key)}
                                            rel="noreferrer"
                                            target="_blank"
                                            data-testid={link.key}
                                            onClick={() =>
                                                trackLinkClick(link.key)
                                            }
                                        >
                                            <div>{translate(link.text)}</div>
                                        </Link>
                                    ) : null
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Grid className="bottom" container>
                <div className={clsx("bottom-items")}>
                    <div className="copyright" data-testid="copyright_label">
                        {translate("footer_copyright").replace(
                            "{{year}}",
                            new Date().getFullYear()
                        )}
                    </div>
                    <div className={clsx("policy-container")}>
                        {footerConfig.policies.map((policy, index) => (
                            <div key={policy.key}>
                                <Link
                                    className="policy"
                                    href={translate(policy.key)}
                                    rel="noreferrer"
                                    target="_blank"
                                    data-testid={policy.key}
                                >
                                    {translate(policy.text)}
                                </Link>
                                {index < footerConfig.policies.length - 1 && (
                                    <span className="separator">|</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <BranchName />
            </Grid>
        </footer>
    ) : null;

    return dynamicContent;
};

export default Footer;
