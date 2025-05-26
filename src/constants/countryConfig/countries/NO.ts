import { Alpha2, Alpha3, optInNotificationTypes } from "../enums";
import euConfig from "../euConfig";
import { CountryConfig, MarketExceptions, ProductConfig } from "../types";

const productConfig: ProductConfig = {
    ...euConfig.productConfig
};

const marketExceptions: MarketExceptions = {
    ...euConfig.marketExceptions,
    taxIdPattern: /^[0-9]{11}$/,
    disableTaxId: false,
    hasSecondaryTaxId: true,
    secondaryTaxIdData: [{ label: "PID" }],
    notificationType: optInNotificationTypes.EMAIL
};

const config: CountryConfig = {
    isSupported: true,
    ...euConfig,
    alpha3: Alpha3.NOR,
    alpha2: Alpha2.NO,
    name: "Norway - Norge",
    phonePrefix: "+47",
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
