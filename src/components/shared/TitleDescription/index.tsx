/** @jsxImportSource @emotion/react */
// import { useOrder } from "Contexts/OrderContext";
import { useSectionsConfig } from "Components/pages/Register/hooks";
import { useUser } from "Contexts/UserContext";
import { useMemo } from "react";
import Catalog from "./components/Catalog";
import DistributorAgreements from "./components/DistributorAgreements";
import Payment from "./components/Payment";
import ShippingAddress from "./components/ShippingAddress";
import UpdateAccount from "./components/UpdateAccount";
import styles from "./styles";

type TitleDescriptionProps = {
    sectionType: string;
};

function defalutHooks(): JSX.Element {
    return <div>Title Description sectionType not valid</div>;
}

function useHookFactory(sectionType: string): () => JSX.Element | null {
    switch (sectionType) {
        case "UpdateAccount":
            return UpdateAccount;
        case "PackSection":
            return Catalog;
        case "ShippingSection":
            return ShippingAddress;
        case "DistributorAgreementsSection":
            return DistributorAgreements;
        case "PaymentSection":
            return Payment;
        default:
            return defalutHooks;
    }
}

// Account: {UserFirstName} {UserLastName}, {userEmail}
// StarterKit: Unimate flavor: {Variant/Lemmon} | Ballance pack: {Orange}
// Shipping: {123 Elm Street, Orem, Utah, 84058 Unicted States}
// Distributor Agreements: Signed {Tue 19 Dec 2023 7:22 PM} --- signatureDateTimeStamp
// Payment: {Icon} {selectedPaymentMethod}

export default function TitleDescription({
    sectionType
}: TitleDescriptionProps): JSX.Element {
    const { activeAccordionSection } = useUser();
    const sectionsConfig = useSectionsConfig(true, activeAccordionSection);
    const willRender = useHookFactory(sectionType)();

    const isActiveSection = useMemo(
        () =>
            sectionsConfig.some(
                section =>
                    section.id === activeAccordionSection &&
                    section.type === sectionType // only evaluate the section we are looking for
            ),
        [sectionsConfig, activeAccordionSection, sectionType]
    );

    const shouldRender = useMemo(
        () =>
            (sectionType === "PaymentSection" && isActiveSection) ||
            (!isActiveSection && sectionType !== "PaymentSection"),
        [isActiveSection, sectionType]
    );

    return <div css={styles}>{shouldRender && willRender}</div>;
}
