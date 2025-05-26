import { Alpha2, Alpha3, optInNotificationTypes } from "../enums";
import euConfig from "../euConfig";
import { CountryConfig, MarketExceptions, ProductConfig } from "../types";

const marketExceptions: MarketExceptions = {
    ...euConfig.marketExceptions,
    paymentOptions: {
        ...euConfig.marketExceptions.paymentOptions,
        hasPayPal: false,
        hasCreditCard: false
    },
    notificationType: optInNotificationTypes.EMAIL,
    zipLength: 4,
    zipPattern: /^\d{4}$/
};

const productConfig: ProductConfig = {
    ...euConfig.productConfig
};

const config: CountryConfig = {
    ...euConfig,
    isSupported: true,
    alpha3: Alpha3.SVN,
    alpha2: Alpha2.SI,
    name: "Slovenia - Slovenija",
    phonePrefix: "+386",
    languages: [
        {
            code: "en",
            name: "English",
            default: false
        }
    ],
    marketExceptions,
    productConfig
};

export default config;
