import { Alpha2, Alpha3, Currency } from "../enums";
import {
    CountryConfig,
    MarketExceptions,
    PaymentLogo,
    PaymentOptions,
    ProductConfig
} from "../types";

const paymentOptionsConfig: PaymentOptions = {
    hasPayPal: false,
    hasCash: false,
    hasBankWire: false,
    hasCreditCard: true,
    hasSavedCreditCard: false
};

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
                    image: "/img/unici-te-lemon-3.png",
                    title: "business_builder_product_1_title",
                    description: "business_builder_product_1_description"
                },
                {
                    image: "/img/balance-3-ESP-MX.png",
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

const marketExceptions: MarketExceptions = {
    zipLength: 5,
    taxIdPattern: undefined,
    taxInclusiveBackEnd: false,
    taxInclusiveFrontEnd: false,
    disableTaxId: true,
    hiddenShippingProvince: false,
    useQuotesToValidateAddress: true,
    showOnboardingGuide: true,
    showVisaAgreement: true,
    directWorldPay: true,
    showStatesField: true,
    // onlyHasWillCall: true,
    paymentOptions: paymentOptionsConfig,
    hiddenShippingQuotesCity: true,
    hiddenShippingQuotesZip: true,
    willCallAddresses: [
        {
            address1: "C. Filomena Gómez de Cova 24",
            address2: "",
            city: "",
            state: "Santo Domingo",
            zip: "",
            country: "DO",
            mapLink: "https://maps.app.goo.gl/M2ZrHftthAjNGE6a7",
            mapLinkKey: "shipping_pickup_link",
            rosettaKey: "shipping_pickup_address"
        }
    ],
    useGlobalFormatCurrency: true
};

const config: CountryConfig = {
    alpha3: Alpha3.DOM,
    alpha2: Alpha2.DO,
    isSupported: true,
    name: "Dominican Republic",
    languages: [
        {
            code: "es",
            name: "Español",
            default: true
        },
        {
            code: "en",
            name: "English",
            default: false
        }
    ],
    marketExceptions,
    productConfig,
    paymentLogos: [
        PaymentLogo.Visa,
        PaymentLogo.Mastercard,
        PaymentLogo.Amex,
        PaymentLogo.Discover
    ],
    currency: Currency.USD,
    dateFormat: "DMY"
};

export default config;
