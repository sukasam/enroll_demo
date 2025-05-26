import { Alpha2, Alpha3, optInNotificationTypes } from "../enums";
import euConfig from "../euConfig";
import { CountryConfig, MarketExceptions, ProductConfig } from "../types";

const marketExceptions: MarketExceptions = {
    ...euConfig.marketExceptions,
    paymentOptions: {
        ...euConfig.marketExceptions.paymentOptions,
        hasPayPal: false
    },
    notificationType: optInNotificationTypes.EMAIL,
    zipLength: [5, 6], // 5 without space, 6 with space
    zipPattern: /^\d{3}\s?\d{2}$/ // \s? makes the space optional
};

const productConfig: ProductConfig = {
    ...euConfig.productConfig
};

const config: CountryConfig = {
    ...euConfig,
    isSupported: true,
    alpha3: Alpha3.GRC,
    alpha2: Alpha2.GR,
    name: "Greece - Ελλάδα",
    phonePrefix: "+30",
    languages: [
        {
            code: "en",
            name: "English",
            default: true
        }
    ],
    marketExceptions,
    productConfig
};

export default config;
