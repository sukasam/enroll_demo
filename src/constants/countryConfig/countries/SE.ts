import { Alpha2, Alpha3, optInNotificationTypes } from "../enums";
import euConfig from "../euConfig";
import { CountryConfig, MarketExceptions, ProductConfig } from "../types";

const productConfig: ProductConfig = {
    ...euConfig.productConfig
};

const marketExceptions: MarketExceptions = {
    ...euConfig.marketExceptions,
    notificationType: optInNotificationTypes.EMAIL,
    zipLength: [5, 6], // 5 without space, 6 with space
    zipPattern: /^\d{3}\s?\d{2}$/ // \s? makes the space optional
};

const config: CountryConfig = {
    isSupported: true,
    ...euConfig,
    alpha3: Alpha3.SWE,
    alpha2: Alpha2.SE,
    name: "Sweden - Sverige",
    phonePrefix: "+46",
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
