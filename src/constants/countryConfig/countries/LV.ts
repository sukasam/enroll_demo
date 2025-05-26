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
    useWorldPay: false,
    zipLength: 7,
    zipPattern: /^LV-\d{4}$/
};

const productConfig: ProductConfig = {
    ...euConfig.productConfig
};

const config: CountryConfig = {
    ...euConfig,
    isSupported: true,
    alpha3: Alpha3.LVA,
    alpha2: Alpha2.LV,
    name: "Latvia - Latvija",
    phonePrefix: "+371",
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
