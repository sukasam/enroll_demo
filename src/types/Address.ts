import { Alpha2 } from "Constants/countryConfig/enums";

export type Address = {
    address1?: string;
    address2?: string;
    city?: string;
    country?: Alpha2;
    zip?: string;
    state?: string;
    email?: string;
    phone?: string;
};

export type AddressWithName = Address & {
    firstName: string;
    lastName: string;
};
