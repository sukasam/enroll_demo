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
                "catalog_modal_business_builder_main_features_8",
                "catalog_modal_business_builder_main_features_9"
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
    hasBankWire: false,
    hasCreditCard: true,
    hasSavedCreditCard: false
};

const marketExceptions: MarketExceptions = {
    zipLength: [5, 9],
    taxIdPattern: /^[0-9]{3}[0-9]{2}[0-9]{4}$/,
    taxInclusiveBackEnd: false,
    taxInclusiveFrontEnd: false,
    disableTaxId: false,
    hasSecondaryTaxId: false,
    hiddenShippingProvince: false,
    useQuotesToValidateAddress: true,
    showOnboardingGuide: true,
    showVisaAgreement: true,
    willCallAddresses: [
        {
            city: "Fort Lauderdale",
            country: "US",
            state: "FL",
            address1: "5310 NW 33rd Avenue",
            address2: "Suite 103",
            zip: "33309",
            mapLink: "https://maps.app.goo.gl/cBujvmNLMsYhfnCa7",
            mapLinkKey: "shipping_pickup_link",
            rosettaKey: "shipping_pickup_address"
        }
    ],
    paymentOptions: paymentOptionsConfig,
    notificationType: optInNotificationTypes.SMS
};

const config: CountryConfig = {
    alpha3: Alpha3.USA,
    alpha2: Alpha2.US,
    isSupported: true,
    productConfig,
    marketExceptions,
    name: "United States",
    languages: [
        {
            name: "English",
            code: "en",
            default: true
        },
        {
            name: "Español",
            code: "es",
            default: false
        }
    ],
    dateFormat: "MDY",
    currency: Currency.USD,
    paymentLogos: [
        PaymentLogo.Visa,
        PaymentLogo.Mastercard,
        PaymentLogo.Amex,
        PaymentLogo.Discover,
        PaymentLogo.JCB
    ]
};

export default config;
