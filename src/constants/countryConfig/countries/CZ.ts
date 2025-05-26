import { Alpha2, Alpha3, optInNotificationTypes } from "../enums";
import euConfig from "../euConfig";
import { CountryConfig, MarketExceptions, ProductConfig } from "../types";

const marketExceptions: MarketExceptions = {
    ...euConfig.marketExceptions,
    paymentOptions: {
        ...euConfig.marketExceptions.paymentOptions,
        hasPayPal: true
    },
    zipLength: [5, 6], // 5 without space, 6 with space
    zipPattern: /^\d{3}\s?\d{2}$/, // \s? makes the space optional
    notificationType: optInNotificationTypes.EMAIL
};

const productConfig: ProductConfig = {
    ...euConfig.productConfig
};

const config: CountryConfig = {
    ...euConfig,
    isSupported: true,
    alpha3: Alpha3.CZE,
    alpha2: Alpha2.CZ,
    name: "Czech Republic - Česká republika",
    phonePrefix: "+420",
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
