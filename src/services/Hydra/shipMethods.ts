import { Alpha2 } from "Constants/countryConfig/enums";
import httpTools from "Shared/httpTools.js";

type GetShipMethodsProps = {
    alpha2: Alpha2;
    state?: string;
};

export type ShippingMethod = {
    location: string;
    market: Alpha2;
    type: string;
};

const getShipMethods = (
    props: GetShipMethodsProps
): Promise<{ items: ShippingMethod[] }> => {
    const { alpha2, state } = props;

    const req = {
        method: "GET",
        url: `/shippingmethods.json?market=${state === "PR" ? "PR" : alpha2}`,
        withAuth: false,
        logOptions: {
            requestName: "Get Shipping Methods",
            error: true,
            functionName: "getShipMethods"
        }
    };

    return httpTools.sendRequest(req);
};

export default getShipMethods;
