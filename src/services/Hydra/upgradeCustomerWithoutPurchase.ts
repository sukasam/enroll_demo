import httpTools from "Shared/httpTools.js";

export type UpgradeCustomerDataPost = {
    taxTerms?: {
        taxId: string;
    };
    identification?: {
        documentId: string;
        documentType: string;
    };
    mainAddress?: {
        city: string;
        country: string;
        zip: string;
        address1: string;
        address2: string;
        state: string;
    };
};

export type UpgradeCustomerDataPatch = {
    status?: string;
    type?: string;
    signature?: {
        value: string;
    };
};

const upgradeCustomerWithoutPurchase = (
    customerData: UpgradeCustomerDataPost | UpgradeCustomerDataPatch,
    customerHref: string,
    userToken: string,
    method: "PATCH" | "POST"
): Promise<Record<string, any>> => {
    const req = {
        method,
        url: `/customers/${customerHref}`,
        headers: {
            "Content-Type": "application/json",
            Accept: "*/*"
        },
        token: userToken,
        data: customerData,
        throwError: true,
        isErrorMessageOverride: true,
        withAuth: true
    };
    return httpTools.sendRequest(req);
};

export default upgradeCustomerWithoutPurchase;
