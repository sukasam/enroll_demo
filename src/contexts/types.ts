import { Alpha2 } from "Constants/countryConfig/enums";
import { Product } from "types/Product";
import { OrderResult } from "./types/OrderContextTypes";

export type Settings = {
    locale: string | null;
    version: string;
    cachedCatalogLocale: string | null;
};

type BaseUser = {
    firstName?: string;
    lastName?: string;
    email: string;
    birthDate: string;
    fullName: string;
    phoneNumber: string;
};

export type EnrollmentUser = BaseUser & {
    taxId?: string;
    secondaryTaxId?: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    country: Alpha2;
    password: string;
    coapplicantFirstName: string;
    coapplicantLastName: string;
    newsletter: boolean;
    enroller: string | null;
    sponsor: string | null;
    commission: "paylution" | "direct_deposit";
    iban: string;
    bankName: string;
    accountHolder: string;
    bic: string;
};

export type UpgradeUser = BaseUser & {
    id: string;
    href: string;
    email: string;
    shippingAddress: object;
    type: string;
};

export type AppContextType = {
    loading: boolean;
    setLoading: (value: boolean) => void;
    locale: string | null;
    setLocale: (value: string) => void;
    version: string;
    selectedSku: string | null;
    setSelectedSku: (value: string) => void;
    enrollerId: string | null;
    setEnrollerId: (value: string | null) => void;
    sponsorId: string | null;
    setSponsorId: (value: string | null) => void;
    products: Product[];
    setProducts: (value: Product[]) => void;
    cachedCatalogLocale: string | null;
    setCachedCatalogLocale: (value: string) => void;
    userData: EnrollmentUser | UpgradeUser | null;
    setUserData: (value: EnrollmentUser | UpgradeUser) => void;
    userToken: string;
    setUserToken: (token: string) => void;
    orderResult: OrderResult | null;
    setOrderResult: (result: OrderResult) => void;
};
