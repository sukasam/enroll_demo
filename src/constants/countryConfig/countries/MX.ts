import { Alpha2, Alpha3, Currency } from "../enums";
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

const paymentOptionsConfig: PaymentOptions = {
    hasPayPal: false,
    hasCash: true,
    hasBankWire: false,
    hasCreditCard: true,
    hasSavedCreditCard: false
};

const marketExceptions: MarketExceptions = {
    zipLength: 5,
    taxIdPattern:
        /^[A-Za-z]{4}[0-9]{2}((0[1-9])|(1[0-2]))(([0-2][0-9])|(3[0-1]))[A-Za-z0-9]{3}$/,
    secondaryTaxIdPattern:
        /^([A-Z&]|[a-z&]{1})([AEIOU]|[aeiou]{1})([A-Z&]|[a-z&]{1})([A-Z&]|[a-z&]{1})([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([HM]|[hm]{1})([AS|as|BC|bc|BS|bs|CC|cc|CS|cs|CH|ch|CL|cl|CM|cm|DF|df|DG|dg|GT|gt|GR|gr|HG|hg|JC|jc|MC|mc|MN|mn|MS|ms|NT|nt|NL|nl|OC|oc|PL|pl|QT|qt|QR|qr|SP|sp|SL|sl|SR|sr|TC|tc|TS|ts|TL|tl|VZ|vz|YN|yn|ZS|zs|NE|ne]{2})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([0-9]{2})$/,
    taxInclusiveBackEnd: false,
    taxInclusiveFrontEnd: false,
    disableTaxId: false,
    hasSecondaryTaxId: true,
    secondaryTaxIdData: [{ label: "RFC" }, { label: "CURP" }],
    hiddenShippingProvince: false,
    useQuotesToValidateAddress: true,
    showOnboardingGuide: true,
    showVisaAgreement: true,
    thankYouImage: "/img/mx-confirmation-success.jpg",
    hideUnicityPhone: true,
    willCallAddresses: [
        {
            address1: "Av. Insurgentes Sur 826 Piso 3 A",
            address2: "Col. Del Valle Centro",
            city: "Benito Juárez",
            state: "Ciudad de Mexico",
            zip: "03100",
            country: "MX",
            mapLink: "https://maps.app.goo.gl/PS1XZjR5Nr8AUbgV8",
            mapLinkKey: "shipping_pickup_link",
            rosettaKey: "shipping_pickup_address"
        }
    ],
    paymentOptions: paymentOptionsConfig,
    showStatesField: true
};

const config: CountryConfig = {
    alpha3: Alpha3.MEX,
    alpha2: Alpha2.MX,
    isSupported: true,
    dateFormat: "MDY",
    name: "Mexico",
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
    currency: Currency.MXN,
    marketExceptions,
    productConfig,
    paymentLogos: [PaymentLogo.Visa, PaymentLogo.Mastercard]
};

export default config;
