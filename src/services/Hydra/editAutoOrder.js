import httpTools from "Shared/httpTools.js";

const editAutoOrder = async ({ data, id, hydraToken }) => {
    const req = {
        method: "PATCH",
        url: `/autoorders/${id}`,
        token: hydraToken,
        data
    };

    try {
        await httpTools.sendRequest(req);
    } catch (error) {
        console.error(error);
    }
};

export default editAutoOrder;
