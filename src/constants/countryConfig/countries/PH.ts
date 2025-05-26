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
    hasPayPal: false,
    hasCash: false,
    hasBankWire: false,
    hasCreditCard: true,
    hasSavedCreditCard: false
};

const marketExceptions: MarketExceptions = {
    zipLength: 4,
    taxIdPattern: /^[0-9]{3}-?[0-9]{2}-?[0-9]{4}$/,
    taxInclusiveBackEnd: false,
    taxInclusiveFrontEnd: false,
    disableTaxId: false,
    hasSecondaryTaxId: false,
    hiddenShippingProvince: false,
    useQuotesToValidateAddress: true,
    showOnboardingGuide: false,
    showVisaAgreement: true,
    willCallAddresses: [
        {
            address1: "Ground Floor, 8/10 Upper McKinley Building",
            address2:
                "Upper McKinley Rd., McKinley Town Center, Fort Bonifacio",
            city: "Taguig",
            state: "Metro Manila",
            country: "PH",
            zip: "1630",
            mapLinkKey: "shipping_pickup_link",
            rosettaKey: "shipping_pickup_address"
        }
    ],
    paymentOptions: paymentOptionsConfig,
    notificationType: optInNotificationTypes.SMS
};

const config: CountryConfig = {
    alpha3: Alpha3.PHL,
    alpha2: Alpha2.PH,
    isSupported: true,
    // redirect: "https://ushop-link.unicity.com/philippines/enroll",
    productConfig,
    marketExceptions,
    name: "Philippines",
    languages: [
        {
            name: "English",
            code: "en",
            default: true
        }
    ],
    dateFormat: "MDY",
    currency: Currency.PHP,
    alwaysShowGuide: true,
    paymentLogos: [PaymentLogo.Visa, PaymentLogo.Mastercard]
};

export default config;
