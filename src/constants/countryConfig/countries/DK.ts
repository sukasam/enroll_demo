import { Alpha2, Alpha3, optInNotificationTypes } from "../enums";
import euConfig from "../euConfig";
import { CountryConfig, MarketExceptions, ProductConfig } from "../types";

const productConfig: ProductConfig = {
    ...euConfig.productConfig
};

const marketExceptions: MarketExceptions = {
    ...euConfig.marketExceptions,
    notificationType: optInNotificationTypes.EMAIL,
    zipLength: 4,
    zipPattern: /^\d{4}$/
};

const config: CountryConfig = {
    isSupported: true,
    ...euConfig,
    alpha3: Alpha3.DNK,
    alpha2: Alpha2.DK,
    name: "Denmark",
    phonePrefix: "+45",
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
