import { styledLogMessage } from "Services/utils/verboseLogger";
import httpTools from "Shared/httpTools.js";

type DDCData = {
    bin: string;
};

type DDCResponse = {
    ddcHTML: string;
    sessionId: string;
};

const initDDC = async (
    cardNumber: string,
    token: string
): Promise<DDCResponse> => {
    try {
        styledLogMessage("Making DDC call", "gray");
        const data: DDCData = {
            bin: cardNumber
        };

        const req = {
            method: "POST",
            url: "/ddc",
            token,
            data
        };
        return httpTools.sendRequest(req);
    } catch (error) {
        styledLogMessage("DDC Call Failed", "red", error);
        throw error;
    }
};

export default initDDC;
