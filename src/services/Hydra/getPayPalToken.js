import httpTools from "Shared/httpTools.js";

const getPayPalToken = ({ market }) => {
    const data = {
        namespace: `${httpTools.envUrl()}/transactions`,
        type: "jwt",
        client: "PayPal"
    };

    const req = {
        method: "POST",
        url: `/clientTokens?market=${market}`,
        data,
        withAuth: false
    };

    return httpTools.sendRequest(req);
};

export default getPayPalToken;
