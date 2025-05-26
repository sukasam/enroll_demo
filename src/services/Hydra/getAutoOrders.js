import httpTools from "Shared/httpTools.js";

const getAutoOrders = ({ hydraToken }) => {
    const req = {
        method: "GET",
        url: "/customers/me/autoorders",
        token: hydraToken
    };

    return httpTools.sendRequest(req);
};

export default getAutoOrders;
