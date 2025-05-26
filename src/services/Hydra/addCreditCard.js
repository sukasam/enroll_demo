import httpTools from "Shared/httpTools.js";

const addCreditCard = async ({ cardName, data, hydraToken }) => {
    const req = {
        method: "POST",
        url: `/customers/me/creditcardaliases/${cardName}`,
        token: hydraToken,
        data,
        logOptions: {
            requestName: "Add Credit Cards",
            response: true,
            error: true,
            functionName: "addCreditCard"
        }
    };

    try {
        await httpTools.sendRequest(req);
    } catch (error) {
        console.error(error);
    }
};

export default addCreditCard;
