import { Currency } from "./enums";
import {
    MarketExceptions,
    PaymentLogo,
    PaymentOptions,
    ProductConfig,
    TemplateSupportedCountryConfig
} from "./types";

const productConfig: ProductConfig = {
    recommendedPack: 0,
    packs: [
        {
            isDigital: false,
            buttonName: "catalog_get_business_builder",
            kitDescription: "business_builder_kit_description",
            mainFeatures: [
                "catalog_modal_business_builder_main_features_1",
                "catalog_modal_business_builder_main_features_2",
                "catalog_modal_business_builder_main_features_3",
                "catalog_modal_business_builder_main_features_4",
                "catalog_modal_business_builder_main_features_5",
                "catalog_modal_business_builder_main_features_6",
                "catalog_modal_business_builder_main_features_7",
                "catalog_modal_business_builder_main_features_8"
            ],
            accentColor: "#FAA977",
            backgroundColor: "#FBF7F1",
            perks: [
                {
                    icon: "/svg/page-with-checkmark.svg",
                    perk: "business_builder_perk_1"
                },
                {
                    icon: "/svg/phone-with-checkmark.svg",
                    perk: "business_builder_perk_2"
                },
                {
                    icon: "/svg/add-people.svg",
                    perk: "business_builder_perk_3"
                }
            ],
            extras: [
                {
                    icon: "/svg/dollar-checkmark-circle.svg",
                    title: "business_builder_extra_1_title",
                    description: "business_builder_extra_1_description"
                }
            ],
            products: [
                {
                    image: "/img/unimate-lemon-3.png",
                    title: "business_builder_product_1_title",
                    description: "business_builder_product_1_description"
                },
                {
                    image: "/img/balance-3.png",
                    title: "business_builder_product_2_title",
                    description: "business_builder_product_2_description"
                }
            ],
            annotations: "business_builder_annotations",
            showPaymentType: true
        },
        {
            name: "basic_name",
            buttonName: "catalog_basic_distributor_only",
            description: "basic_description",
            isDigital: true,
            showPaymentType: true
        }
    ]
};

const paymentOptionsConfig: PaymentOptions = {
    hasPayPal: true,
    hasCash: false,
    hasBankWire: true,
    hasCreditCard: true,
    hasSavedCreditCard: false,
    hasKlarna: false
};

const marketExceptions: MarketExceptions = {
    zipLength: 4,
    taxIdPattern: undefined,
    disableTaxId: true,
    taxInclusiveBackEnd: false,
    taxInclusiveFrontEnd: false,
    hiddenShippingProvince: true,
    useQuotesToValidateAddress: true,
    hasCommissionPaymentOptions: true,
    showOnboardingGuide: false,
    showVisaAgreement: false,
    paymentOptions: paymentOptionsConfig,
    useWorldPay: true,
    usePayPal3ds: true,
    hiddenDecimal: false,
    useGlobalFormatCurrency: true,
    hiddenPersonalData: true,
    useCookie: true,
    updateMainAddress: true
};

const euConfig: TemplateSupportedCountryConfig = {
    dateFormat: "DMY",
    languages: [
        {
            code: "en",
            name: "English",
            default: true
        }
    ],
    currency: Currency.EUR,
    alwaysShowGuide: true,
    paymentLogos: [PaymentLogo.Visa, PaymentLogo.Mastercard],
    productConfig,
    marketExceptions
};

export default euConfig;
