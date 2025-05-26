import commonConfig from "../commonConfig";
import { Alpha2, Alpha3, Currency } from "../enums";
import {
    CountryConfig,
    MarketExceptions,
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
    ...commonConfig.productConfig
};

const marketExceptions: MarketExceptions = {
    ...commonConfig.marketExceptions,
    zipPattern: /^\d{3}(-?\d{4})$/,
    paymentOptions: paymentOptionsConfig,
    useWorldPay: true,
    taxInclusiveBackEnd: true,
    taxInclusiveFrontEnd: false,
    willCallAddresses: [
        {
            city: "Tokyo",
            country: "JP",
            state: "Tokyo",
            address1: "1-15-4 Ginza, Chuo-ku",
            address2: "Hulic Ginza 1-chome Showa-dori Bldg. 3F",
            zip: "104-0061",
            mapLink: "https://maps.app.goo.gl/Lmd1VQDj6QXh2FiS7",
            mapLinkKey: "shipping_pickup_link",
            rosettaKey: "shipping_pickup_address"
        },
        {
            city: "Osaka",
            country: "JP",
            state: "Osaka",
            address1: "4-4-10 Minamisenba, Chuo-ku",
            address2: "Tatsuno Shinsaibashi Bldg. 7F",
            zip: "542-0081",
            mapLink: "https://maps.app.goo.gl/GGLpRi3Gww5G9DAaA",
            mapLinkKey: "shipping_pickup_link_2",
            rosettaKey: "shipping_pickup_address_2"
        }
    ],
    showOnlineRegistration: true,
    hiddenShippingCity: true,
    hiddenTooltip: true,
    hiddenDecimal: true,
    updateMainAddress: true,
    notificationType: undefined,
    showMemberApplicationGuide: true,
    hiddenEnrollerId: true
};

const config: CountryConfig = {
    alpha3: Alpha3.JPN,
    alpha2: Alpha2.JP,
    ...commonConfig,
    dateFormat: "DMY",
    isSupported: true,
    name: "Japan - 日本",
    phonePrefix: "+81",
    languages: [
        {
            code: "ja",
            name: "Japanese",
            default: true
        },
        {
            code: "en",
            name: "English",
            default: false
        }
    ],
    alwaysShowGuide: true,
    marketExceptions,
    productConfig,
    currency: Currency.JPY,
    addressFormat: "{zip}, {country}, {address1}, {address2}"
};

export default config;
