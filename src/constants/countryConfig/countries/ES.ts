import { Alpha2, Alpha3, optInNotificationTypes } from "../enums";
import euConfig from "../euConfig";
import { CountryConfig, MarketExceptions, ProductConfig } from "../types";

const productConfig: ProductConfig = {
    ...euConfig.productConfig
};

const marketExceptions: MarketExceptions = {
    ...euConfig.marketExceptions,
    notificationType: optInNotificationTypes.EMAIL,
    zipLength: 5,
    zipPattern: /^\d{5}$/
};

const config: CountryConfig = {
    isSupported: true,
    ...euConfig,
    alpha3: Alpha3.ESP,
    alpha2: Alpha2.ES,
    name: "Spain - España",
    phonePrefix: "+34",
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
    productConfig
};

export default config;
