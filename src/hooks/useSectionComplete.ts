import { useSectionsConfig } from "Components/pages/Register/hooks";
import { useCountryConfig } from "Constants/countryConfig";
import { useOrder } from "Contexts/OrderContext";
import { useProducts } from "Contexts/ProductContext";
import { AddressType } from "Contexts/types/OrderContextTypes";
import { useUser } from "Contexts/UserContext";
import { useCallback, useMemo } from "react";

export type SectionCompleteType = {
    isAccountCreationComplete: boolean;
    isCatalogComplete: boolean;
    isShippingComplete: boolean;
    isDistributorAgreementComplete: boolean;
    isChangeHidden: (sectionId: number) => boolean;
};

export default function useSectionComplete(): SectionCompleteType {
    const { shoppingCart } = useProducts();

    const {
        signedTerms,
        userSignature,
        signatureDateTimeStamp,
        selectedPaymentMethod,
        shipToAddress
    } = useOrder();
    const { activeAccordionSection, isLoggedIn, userData, mainAddress } =
        useUser();
    const countryConfig = useCountryConfig();
    const sectionsConfig = useSectionsConfig(
        isLoggedIn,
        activeAccordionSection,
        countryConfig?.isNoPurchaseMarket
    );

    const isAccountCreationComplete = useMemo(
        () =>
            !!(
                isLoggedIn &&
                userData &&
                userData.email &&
                userData.firstName &&
                userData.lastName
            ),
        [isLoggedIn, userData]
    );

    const isCatalogComplete = useMemo(() => {
        const selectedProduct = shoppingCart?.find(product => product?.options);
        if (!selectedProduct) return false;
        if (selectedProduct.isDigital) return true;
        const unimateFlavor =
            selectedProduct?.options?.unimate_flavour?.title || null;
        const ballanceFlavor =
            selectedProduct?.options?.balance_pack?.title || null;
        return !!(unimateFlavor && ballanceFlavor);
    }, [shoppingCart]);

    const isShippingComplete = useMemo(() => {
        const address =
            countryConfig?.isNoPurchaseMarket ||
            countryConfig?.marketExceptions.onlyHasWillCall
                ? mainAddress
                : shipToAddress;

        // Define all possible fields and their requirements
        const fieldRequirements = {
            address1: true,
            city: !countryConfig?.marketExceptions.hiddenShippingQuotesCity,
            zip: !countryConfig?.marketExceptions.hiddenShippingQuotesZip,
            country: true,
            state: !countryConfig?.marketExceptions.hiddenShippingProvince
        };

        // Get required fields based on requirements
        const requiredFields = Object.entries(fieldRequirements)
            .filter(([_, isRequired]) => isRequired)
            .map(([field]) => field);

        return requiredFields.every(
            (field): field is keyof AddressType =>
                !!address?.[field as keyof AddressType]
        );
    }, [shipToAddress, mainAddress, countryConfig]);

    const isDistributorAgreementComplete = useMemo(
        () => !!(signedTerms && userSignature && signatureDateTimeStamp),
        [signedTerms, userSignature, signatureDateTimeStamp]
    );

    const isChangeHidden = useCallback(
        (sectionId: number) => {
            if (sectionId === activeAccordionSection) return true;
            const sectionConfig = sectionsConfig.find(
                section => section.id === sectionId
            );
            if (!sectionConfig) return true;
            switch (sectionConfig.type) {
                case "UpdateAccount":
                    return !isAccountCreationComplete;
                case "PackSection":
                    return !isCatalogComplete;
                case "DistributorOnly":
                    return !isCatalogComplete;
                case "ShippingSection":
                    return !isShippingComplete;
                case "DistributorAgreementsSection":
                    return !isDistributorAgreementComplete;
                case "PaymentSection":
                    return !selectedPaymentMethod;
                default:
                    return true;
            }
        },
        [
            sectionsConfig,
            activeAccordionSection,
            isAccountCreationComplete,
            isCatalogComplete,
            isShippingComplete,
            isDistributorAgreementComplete,
            selectedPaymentMethod
        ]
    );

    return {
        isAccountCreationComplete,
        isCatalogComplete,
        isShippingComplete,
        isDistributorAgreementComplete,
        isChangeHidden
    };
}
