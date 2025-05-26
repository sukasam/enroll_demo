import { Alpha2, Alpha3, Currency, optInNotificationTypes } from "../enums";
import {
    CountryConfig,
    MarketExceptions,
    PaymentLogo,
    PaymentOptions,
    ProductConfig
} from "../types";

const productConfig: ProductConfig = {
    recommendedPack: 0,
    packs: [
        {
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
                "catalog_modal_business_builder_main_features_8",
                "catalog_modal_business_builder_main_features_9"
            ],
            accentColor: "#7BBC7A",
            backgroundColor: "#F2F9F8",
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
            showPaymentType: true,
            isDigital: false
        },
        // Is automatically added to order but not displayed
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
    hasBankWire: false,
    hasCreditCard: true,
    hasSavedCreditCard: false
};

const marketExceptions: MarketExceptions = {
    zipLength: [6, 7],
    zipPattern: /^[a-zA-Z0-9]{3}[ -]?[a-zA-Z0-9]{3}$/,
    taxInclusiveBackEnd: false,
    taxInclusiveFrontEnd: false,
    disableTaxId: true,
    hiddenShippingProvince: false,
    useQuotesToValidateAddress: true,
    showOnboardingGuide: true,
    showVisaAgreement: true,
    paymentOptions: paymentOptionsConfig,
    notificationType: optInNotificationTypes.SMS
};

const config: CountryConfig = {
    alpha3: Alpha3.CAN,
    alpha2: Alpha2.CA,
    isSupported: true,
    productConfig,
    name: "Canada",
    currency: Currency.CAD,
    marketExceptions,
    languages: [
        {
            code: "en",
            name: "English",
            default: true
        },
        {
            code: "fr",
            name: "Français",
            default: false
        }
    ],
    dateFormat: "MDY",
    paymentLogos: [
        PaymentLogo.Visa,
        PaymentLogo.Mastercard,
        PaymentLogo.Amex,
        PaymentLogo.Discover
    ]
};

export default config;
