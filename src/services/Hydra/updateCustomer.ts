import httpTools from "Shared/httpTools.js";

interface CustomerData {
    [key: string]: any;
}

const updateCustomer = (
    customerData: CustomerData,
    customerHref: string,
    userToken: string
): Promise<Record<string, string>> => {
    const req = {
        method: "POST",
        url: `/customers/${customerHref}`,
        headers: {
            "Content-Type": "application/json",
            Accept: "*/*"
        },
        withAuth: true,
        token: userToken,
        data: customerData,
        throwError: true
    };
    return httpTools.sendRequest(req);
};

export default updateCustomer;
