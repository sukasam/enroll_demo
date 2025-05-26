import { Alpha2, Alpha3 } from "../enums";
import { CountryConfig, MarketExceptions, PaymentOptions } from "../types";

const paymentOptionsConfig: PaymentOptions = {
    hasPayPal: false,
    hasCash: false,
    hasBankWire: false,
    hasCreditCard: false,
    hasSavedCreditCard: false
};

const marketExceptions: MarketExceptions = {
    zipLength: null, // Auto config generator: Used default value
    taxIdPattern: undefined, // Auto config generator: Used default value
    taxInclusiveBackEnd: false,
    taxInclusiveFrontEnd: false,
    disableTaxId: false, // Auto config generator: Used default value
    hiddenShippingProvince: false,
    useQuotesToValidateAddress: false, // Auto config generator: Used default value
    paymentOptions: paymentOptionsConfig
};

const config: CountryConfig = {
    alpha3: Alpha3.VIR,
    alpha2: Alpha2.VI,
    isSupported: false,
    name: "Virgin Islands, U.S.",
    redirect: undefined,
    languages: [
        {
            code: "en",
            name: "English",
            default: true
        }
    ],
    marketExceptions
};

export default config;
