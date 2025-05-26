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
    hasBankWire: true,
    hasCreditCard: true,
    hasSavedCreditCard: false,
    hasKlarna: true
};

const marketExceptions: MarketExceptions = {
    zipPattern:
        /^(GIR 0AA|(?:(?:[A-PR-UWYZ][0-9]{1,2}|[A-PR-UWYZ][A-HK-Y][0-9]{1,2}|[A-PR-UWYZ][0-9][A-HJKPSTUW]|[A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRVWXY])\s?[0-9][ABD-HJLNP-UW-Z]{2}))$/,
    taxIdPattern: undefined, // Auto config generator: Used default value
    taxInclusiveBackEnd: false,
    taxInclusiveFrontEnd: false,
    disableTaxId: true,
    hiddenShippingProvince: true,
    useQuotesToValidateAddress: true,
    hasCommissionPaymentOptions: true,
    showOnboardingGuide: false,
    showVisaAgreement: false,
    paymentOptions: paymentOptionsConfig,
    useWorldPay: true,
    usePayPal3ds: true,
    notificationType: optInNotificationTypes.EMAIL,
    zipLength: [5, 8],
    hiddenPersonalData: true,
    useCookie: true,
    updateMainAddress: true
};

const config: CountryConfig = {
    alpha3: Alpha3.GBR,
    alpha2: Alpha2.GB,
    isSupported: true,
    marketExceptions,
    productConfig,
    name: "United Kingdom",
    languages: [
        {
            code: "en",
            name: "English",
            default: true
        }
    ],
    dateFormat: "DMY",
    phonePrefix: "+44",
    currency: Currency.GBP,
    alwaysShowGuide: true,
    paymentLogos: [PaymentLogo.Visa, PaymentLogo.Mastercard]
};

export default config;
