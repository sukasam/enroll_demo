import { Alpha2 } from "Constants/countryConfig/enums";
import httpTools from "Shared/httpTools.js";

interface Region {
    name: string;
    value: string;
}

const getRegions = (
    alpha2: Alpha2
): Promise<{ items?: Region[]; error?: string }> => {
    const req = {
        method: "GET",
        url: `/countries/${alpha2}/regions.json`,
        withAuth: false,
        logOptions: {
            requestName: "Get Regions",
            error: true,
            functionName: "getRegions"
        }
    };

    return httpTools.sendRequest(req);
};

export default getRegions;
