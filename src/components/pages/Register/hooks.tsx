import TitleDescription from "Components/shared/TitleDescription";
import {
    ComponentType,
    lazy,
    LazyExoticComponent,
    Suspense,
    useMemo
} from "react";

type Section = {
    id: number;
    title: string;
    type: string;
    props: Record<string, any>;
    sidebarContent: JSX.Element | null;
    completedDescription: JSX.Element | null;
};

const getAccountTitle = (
    isLoggedIn: boolean,
    activeAccordionSection: number | null
): string => {
    if (isLoggedIn && activeAccordionSection !== 1) {
        return "step_account";
    }
    if (isLoggedIn && activeAccordionSection === 1) {
        return "step_update_your_account";
    }
    return "create_account_create_your_account";
};

function LazySidebarContent<T>({
    component: Component,
    sidebarProps
}: {
    component: LazyExoticComponent<ComponentType<T>>;
    sidebarProps?: T;
}): JSX.Element {
    return (
        <Suspense fallback={<div>Loading sidebar...</div>}>
            <Component {...(sidebarProps as any)} />
        </Suspense>
    );
}

export const useSectionsConfig = (
    isLoggedIn: boolean,
    activeAccordionSection: number | null,
    isNoPurchaseMarket = false
): Section[] =>
    useMemo(() => {
        const defaultConfig = [
            {
                id: 1,
                title: getAccountTitle(isLoggedIn, activeAccordionSection),
                type: isLoggedIn ? "UpdateAccount" : "CreateAccount",
                props: {},
                sidebarContent: (
                    <LazySidebarContent
                        component={lazy(
                            () =>
                                import(
                                    "./components/CreateAccount/components/GettingStarted"
                                )
                        )}
                    />
                ),
                completedDescription: (
                    <TitleDescription sectionType="UpdateAccount" />
                )
            },
            {
                id: 2,
                title: "step_starter_kit",
                type: "PackSection",
                props: {},
                sidebarContent: (
                    <LazySidebarContent
                        component={lazy(
                            () =>
                                import(
                                    "./components/Catalog/components/PackBenefits"
                                )
                        )}
                    />
                ),
                completedDescription: (
                    <TitleDescription sectionType="PackSection" />
                )
            },
            {
                id: 3,
                title: "step_shipping",
                type: "ShippingSection",
                props: {},
                sidebarContent: (
                    <LazySidebarContent
                        component={lazy(
                            () => import("Components/shared/ProductSidebar")
                        )}
                    />
                ),
                completedDescription: (
                    <TitleDescription sectionType="ShippingSection" />
                )
            },
            {
                id: 4,
                title: "create_account_agreements",
                type: "DistributorAgreementsSection",
                props: {},
                sidebarContent: (
                    <LazySidebarContent
                        component={lazy(
                            () => import("Components/shared/ProductSidebar")
                        )}
                    />
                ),
                completedDescription: (
                    <TitleDescription sectionType="DistributorAgreementsSection" />
                )
            },
            {
                id: 5,
                title: "step_payment",
                type: "PaymentSection",
                props: {},
                sidebarContent: (
                    <LazySidebarContent
                        sidebarProps={{ showPricingBreakdown: true }}
                        component={lazy(
                            () => import("components/shared/ProductSidebar")
                        )}
                    />
                ),
                completedDescription: (
                    <TitleDescription sectionType="PaymentSection" />
                )
            }
        ];

        const noPurchaseConfig = [
            {
                id: 1,
                title: getAccountTitle(isLoggedIn, activeAccordionSection),
                type: isLoggedIn ? "UpdateAccount" : "CreateAccount",
                props: {},
                sidebarContent: (
                    <LazySidebarContent
                        component={lazy(
                            () =>
                                import(
                                    "./components/CreateAccount/components/GettingStarted"
                                )
                        )}
                    />
                ),
                completedDescription: (
                    <TitleDescription sectionType="UpdateAccount" />
                )
            },
            {
                id: 2,
                title: "step_starter_kit",
                type: "DistributorOnly",
                props: {},
                sidebarContent: (
                    <LazySidebarContent
                        component={lazy(
                            () =>
                                import(
                                    "./components/Catalog/components/PackBenefits"
                                )
                        )}
                    />
                ),
                completedDescription: (
                    <TitleDescription sectionType="PackSection" />
                )
            },
            {
                id: 3,
                title: "step_shipping",
                type: "ShippingSection",
                props: {},
                sidebarContent: null,
                completedDescription: (
                    <TitleDescription sectionType="ShippingSection" />
                )
            },
            {
                id: 4,
                title: "create_account_agreements",
                type: "DistributorAgreementsSection",
                props: {},
                sidebarContent: null,
                completedDescription: (
                    <TitleDescription sectionType="DistributorAgreementsSection" />
                )
            }
        ];

        return isNoPurchaseMarket ? noPurchaseConfig : defaultConfig;
    }, [isLoggedIn, activeAccordionSection, isNoPurchaseMarket]);

export function SectionFactory({
    type,
    props
}: {
    type: string;
    props: Record<string, any>;
}): JSX.Element | null {
    let Component = null;

    switch (type) {
        case "CreateAccount":
            Component = lazy(() => import("./components/CreateAccount"));
            break;
        case "UpdateAccount":
            Component = lazy(() => import("./components/UpdateAccount"));
            break;
        case "PackSection":
            Component = lazy(
                () => import("./components/Catalog/components/PackSection")
            );
            break;
        case "DistributorOnly":
            Component = lazy(
                () => import("./components/Catalog/components/DistributorOnly")
            );
            break;
        case "ShippingSection":
            Component = lazy(() => import("./components/Shipping"));
            break;
        case "DistributorAgreementsSection":
            Component = lazy(
                () => import("./components/DistributorAgreements")
            );
            break;
        case "PaymentSection":
            Component = lazy(() => import("./components/Payment"));
            break;
        default:
            Component = lazy(() => import("./components/CreateAccount"));
    }

    return Component ? (
        <Suspense fallback={<div>Loading...</div>}>
            <Component {...props} />
        </Suspense>
    ) : null;
}
