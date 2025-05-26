/** @jsxImportSource @emotion/react */
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import footerConfig from "Constants/footerConfig";
import { TranslationProvider } from "Contexts/translation";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import Footer from "./index";

jest.mock("next/image", () => props => <img {...props} alt="test-img" />);
jest.mock("./components/BranchName", () => ({
    __esModule: true,
    default: () => <div data-testid="branch-name">BranchName</div>
}));
jest.mock("Services/mixpanel/initializeMixPanel", () => ({
    trackEvent: jest.fn()
}));

const setup = (translationProps = {}) =>
    render(
        <TranslationProvider
            testValues={{
                translations: {
                    unicity_logo: "Unicity Logo",
                    footer_copyright:
                        "© 2024 Copyright Unicity International, Inc. All Rights Reserved.",
                    ...footerConfig.socialLinks.reduce((acc, link) => {
                        acc[link.key] = link.key;
                        acc[link.alt] = link.alt;
                        return acc;
                    }, {}),
                    ...footerConfig.sections.reduce((acc, section) => {
                        acc[section.title] = section.title;
                        section.links.forEach(link => {
                            acc[link.key] = link.key;
                            acc[link.text] = link.text;
                        });
                        return acc;
                    }, {}),
                    ...footerConfig.policies.reduce((acc, policy) => {
                        acc[policy.key] = policy.text;
                        return acc;
                    }, {}),
                    ...translationProps.translations
                },
                country: "US",
                language: "en",
                ...translationProps
            }}
        >
            <Footer />
        </TranslationProvider>
    );

describe("Footer component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("matches snapshot", () => {
        const { container } = setup();
        expect(container.firstChild).toMatchSnapshot();
    });

    test("renders the Unicity logo", () => {
        const { getByTestId } = setup();
        const logo = getByTestId("Unicity Logo");
        expect(logo).toBeInTheDocument();
    });

    test("renders social links", () => {
        const { getByTestId } = setup();
        footerConfig.socialLinks.forEach(link => {
            const socialLink = getByTestId(link.key);
            expect(socialLink).toBeInTheDocument();
        });
    });

    test("renders section titles", () => {
        const { getByTestId } = setup();
        footerConfig.sections.forEach(section => {
            const sectionTitle = getByTestId(section.title);
            expect(sectionTitle).toBeInTheDocument();
        });
    });

    test("renders policy links", () => {
        const { getByTestId } = setup();
        footerConfig.policies.forEach(policy => {
            const policyLink = getByTestId(policy.key);
            expect(policyLink).toBeInTheDocument();
        });
    });

    test("renders BranchName component", () => {
        const { getByTestId } = setup();
        const branchName = getByTestId("branch-name");
        expect(branchName).toBeInTheDocument();
    });

    test("does not render social links without translations", () => {
        const { queryByTestId } = setup({
            translations: {}
        });
        footerConfig.socialLinks.forEach(link => {
            const socialLink = queryByTestId(link.key);
            expect(socialLink).not.toBeInTheDocument();
        });
    });

    test("does not render section links without translations", () => {
        const { queryByTestId } = setup({
            translations: {
                ...footerConfig.sections.reduce((acc, section) => {
                    acc[section.title] = section.title;
                    return acc;
                }, {})
            }
        });
        footerConfig.sections.forEach(section => {
            section.links.forEach(link => {
                const sectionLink = queryByTestId(link.key);
                expect(sectionLink).not.toBeInTheDocument();
            });
        });
    });

    test("renders copyright text", () => {
        const { getByTestId } = setup();
        const copyright = getByTestId("copyright_label");
        expect(copyright).toBeInTheDocument();
        expect(copyright).toHaveTextContent(
            "© 2024 Copyright Unicity International, Inc. All Rights Reserved."
        );
    });

    test("renders policy separators correctly", () => {
        const { container } = setup();
        const separators = container.querySelectorAll(".separator");
        expect(separators.length).toBe(footerConfig.policies.length - 1);
    });

    test("applies correct attributes to social links", () => {
        const { getByTestId } = setup();
        footerConfig.socialLinks.forEach(link => {
            const socialLink = getByTestId(link.key);
            expect(socialLink).toHaveAttribute("href", link.key);
            expect(socialLink).toHaveAttribute("target", "_blank");
            expect(socialLink).toHaveAttribute("rel", "noreferrer");
        });
    });

    test("applies correct attributes to section links", () => {
        const { getByTestId } = setup();
        footerConfig.sections.forEach(section => {
            section.links.forEach(link => {
                const sectionLink = getByTestId(link.key);
                expect(sectionLink).toHaveAttribute("href", link.key);
                expect(sectionLink).toHaveAttribute("target", "_blank");
                expect(sectionLink).toHaveAttribute("rel", "noreferrer");
            });
        });
    });
    describe("Footer link mixpanel tracking", () => {
        const TRACKING_TEST_CASES = [
            // Section links
            {
                testId: "footer_our_company_link",
                expectedAction: "our_company"
            },
            { testId: "footer_science_link", expectedAction: "science" },
            {
                testId: "footer_unicity_blog_link",
                expectedAction: "unicity_blog"
            },
            { testId: "footer_contact_us_link", expectedAction: "contact" },
            // Social media links
            { testId: "footer_twitter_link", expectedAction: "social_x" },
            {
                testId: "footer_facebook_link",
                expectedAction: "social_facebook"
            },
            {
                testId: "footer_pintrest_link",
                expectedAction: "social_pinterest"
            },
            {
                testId: "footer_instagram_link",
                expectedAction: "social_instagram"
            },
            { testId: "footer_youtube_link", expectedAction: "social_youtube" }
        ];

        test.each(TRACKING_TEST_CASES)(
            "tracks $testId click with action $expectedAction",
            ({ testId, expectedAction }) => {
                const { getByTestId } = setup();
                const link = getByTestId(testId);

                link.click();

                expect(mixpanelService.trackEvent).toHaveBeenCalledWith(
                    "enr_footer_link_clicked",
                    { action: expectedAction }
                );
            }
        );

        test("does not track events on render", () => {
            setup();
            expect(mixpanelService.trackEvent).not.toHaveBeenCalled();
        });

        test("tracks each link click only once", () => {
            const { getByTestId } = setup();
            const link = getByTestId("footer_our_company_link");

            link.click();

            expect(mixpanelService.trackEvent).toHaveBeenCalledTimes(1);
        });

        test("handles tracking errors gracefully", () => {
            const { getByTestId } = setup();
            const link = getByTestId("footer_our_company_link");

            mixpanelService.trackEvent.mockImplementationOnce(() => {
                throw new Error("Mixpanel error");
            });

            // Should not throw when clicking
            expect(() => link.click()).not.toThrow();
        });
    });
});
