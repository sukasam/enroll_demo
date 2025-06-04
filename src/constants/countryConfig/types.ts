import { Alpha2, Alpha3, Currency, optInNotificationTypes } from "./enums";

export type Language = {
    code: string;
    name: string;
};

export interface PackPerk {
    icon: string;
    perk: string;
}

export interface PackExtra {
    icon: string;
    title: string;
    description: string;
}

export interface PackProduct {
    image: string;
    title: string;
    description: string;
}

export interface VariantOption {
    // Id within option to distinguish between values. Each option has its own set of ids.
    interOptionId: number;
    title: string;
    description?: string;
    disclaimer?: string;
    limitedColor?: string;
    image?: string;
}

export interface Variant {
    sku: string;
    name: string;
    description: string;
    productImage: any;
    partsCount: string;
    tabImage: any;
    options: {
        [key: string]: VariantOption;
    };
    price: number;
    rrp: number;
}

export interface DigitalPack {
    name: string;
    isDigital: true;
    buttonName: string;
    description: string;
    showPaymentType: boolean;
}

export interface CompleteDigitalPack extends DigitalPack {
    variants: Variant[];
}

export interface Pack {
    mainFeatures: string[];
    accentColor: string;
    buttonName: string;
    kitDescription: string;
    backgroundColor: string;
    perks: PackPerk[];
    extras: PackExtra[];
    products?: PackProduct[];
    annotations: string;
    showPaymentType: boolean;
    isDigital: false;
}

export interface CompletePack extends Pack {
    variants: Variant[];
}

export type ProductConfig = {
    recommendedPack: number | null;
    packs: (Pack | DigitalPack)[];
};

export type CompleteProductConfig = {
    recommendedPack: number;
    packs: (CompletePack | CompleteDigitalPack)[];
};

export interface WillCallAddress {
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    mapLink?: string;
    mapLinkKey?: string;
    rosettaKey?: string;
}

export type PaymentOptions = {
    hasPayPal?: boolean;
    hasCash?: boolean;
    hasBankWire?: boolean;
    hasCreditCard?: boolean;
    hasSavedCreditCard?: boolean;
    hasKlarna?: boolean;
};

export type MarketExceptions = {
    zipLength?: number | number[] | null;
    zipPattern?: RegExp | null;
    taxIdPattern?: RegExp;
    secondaryTaxIdPattern?: RegExp;
    taxInclusiveFrontEnd?: boolean;
    taxInclusiveBackEnd?: boolean;
    hasSecondaryTaxId?: boolean;
    secondaryTaxIdData?: {
        label: string;
    }[];
    disableTaxId?: boolean;
    hiddenShippingProvince?: boolean;
    useQuotesToValidateAddress?: boolean;
    hasCommissionPaymentOptions?: boolean;
    showOnboardingGuide?: boolean;
    showVisaAgreement?: boolean;
    hiddenShippingQuotesCity?: boolean;
    hiddenShippingQuotesZip?: boolean;
    willCallAddresses?: WillCallAddress[];
    thankYouImage?: string;
    hideUnicityPhone?: boolean;
    paymentOptions?: PaymentOptions;
    showStatesField?: boolean;
    useWorldPay?: boolean;
    directWorldPay?: boolean;
    usePayPal3ds?: boolean;
    notificationType?: optInNotificationTypes | undefined;
    onlyHasWillCall?: boolean;
    showOnlineRegistration?: boolean;
    hiddenShippingCity?: boolean;
    hiddenTooltip?: boolean;
    hiddenDecimal?: boolean;
    updateMainAddress?: boolean;
    showMemberApplicationGuide?: boolean;
    useGlobalFormatCurrency?: boolean;
    hiddenEnrollerId?: boolean;
    hiddenPersonalData?: boolean;
    useCookie?: boolean;
    formCreateAccount?: string[];
    formUpdateAccount?: string[];
};

type BaseCountryConfig = {
    alpha3: Alpha3;
    alpha2: Alpha2;
    name: string;
    languages: { code: string; name: string; default: boolean }[];
    marketExceptions: MarketExceptions;
};

export enum PaymentLogo {
    Visa = "visa",
    Mastercard = "mastercard",
    Amex = "amex",
    Discover = "discover",
    PayPal = "paypal",
    JCB = "jcb"
}

export type SupportedCountryConfig = {
    isSupported: true;
    productConfig: ProductConfig;
    currency: Currency | null;
    paymentLogos: PaymentLogo[];
    dateFormat: "YMD" | "DMY" | "MDY";
    phonePrefix?: string;
    alwaysShowGuide?: boolean;
    isNoPurchaseMarket?: boolean;
    addressFormat?: string;
} & BaseCountryConfig;

export type UnsupportedCountryConfig = Omit<
    Partial<SupportedCountryConfig>,
    "isSupported"
> & {
    isSupported: false;
    redirect?: string;
} & BaseCountryConfig;

export type CountryConfig = SupportedCountryConfig | UnsupportedCountryConfig;

type OmittedProps =
    | "alpha2"
    | "alpha3"
    | "name"
    | "phonePrefix"
    | "isSupported"; // List the properties to omit
export type TemplateSupportedCountryConfig = {
    [K in keyof SupportedCountryConfig as K extends OmittedProps
        ? never
        : K]: SupportedCountryConfig[K];
};

export type Locale = {
    countryCode: Alpha2 | null;
    language: string | null;
};
