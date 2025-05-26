import httpTools from "Shared/httpTools.js";

export interface AddressSuggestion {
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    zip5?: string;
    zip4?: string;
    country: string;
    unique?: boolean;
    addressId?: string;
    entries?: number | undefined;
}

interface ValidateAddressParams {
    address1: string;
    address2?: string;
    city: string;
    state?: string;
    zip: string;
    country: string;
}

export const validateAddress = (
    params: ValidateAddressParams
): Promise<{ items: AddressSuggestion[]; error?: string }> => {
    const req = {
        method: "GET",
        url: "/addresses",
        withAuth: false,
        queryParams: params
    };
    return httpTools.sendRequest(req);
};
export default {
    validateAddress
};
