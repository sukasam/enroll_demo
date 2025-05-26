import pjson from "Root/package.json";
import httpTools from "Shared/httpTools.js";
import getPlatform from "Utils/getPlatform";
import { Address } from "types/Address";
import { CustomerType } from "types/enums";

interface CalculateOrderProps {
    items: string[];
    shippingMethod: {
        type: string;
        location?: string;
    };
    shipToAddress: Address;
    customerType: CustomerType;
}

type CalculateOrderResult =
    | {
          tax: number;
          shipping: number;
          total: number;
          discount: number;
          addedSkus: number;
          lines: number;
          subtotal: number;
          error: undefined;
      }
    | {
          error: {
              message: string;
              // eslint-disable-next-line camelcase
              error_message: string;
          };
      };

async function calculateOrder(
    props: CalculateOrderProps
): Promise<CalculateOrderResult> {
    const { items, shippingMethod, shipToAddress, customerType } = props;
    const envUrl = httpTools.envUrl();
    if (!shippingMethod) {
        throw new Error("Shipping method is required");
    }

    const { type, location } = shippingMethod;

    const order = {
        order: {
            customer: {
                href: `${envUrl}/customers?type=${customerType}`
            },
            lines: {
                items: items.map(item => ({
                    item: {
                        href: `${envUrl}/items?id.unicity=${item}`
                    },
                    quantity: 1
                }))
            },
            shipToAddress,
            shippingMethod: {
                href: `${envUrl}/shippingmethods?type=${encodeURI(type)}${
                    location ? `&location=${location}` : ""
                }`
            },
            type: "Order",
            source: {
                medium: "Internet",
                agent: "Enroll-OrderCalc",
                version: pjson.version,
                platform: getPlatform(),
                market: shipToAddress?.country
            }
        }
    };

    const req = {
        method: "POST",
        url: "/quotes",
        data: order,
        withAuth: false
    };

    const resultRaw = await httpTools.sendRequest(req);

    if (!resultRaw || !resultRaw.items || resultRaw.items.length === 0) {
        throw new Error("Could not calculate order");
    }

    const [firstItem] = resultRaw.items;
    const { terms } = firstItem;

    if (!terms) {
        throw new Error("Could not calculate order");
    }

    const {
        tax: { amount: tax = 0 },
        freight: { amount: shipping = 0 },
        total = 0,
        discount: { amount: discount = 0 },
        subtotal = 0
    } = terms;
    return {
        tax,
        shipping,
        total,
        discount,
        addedSkus: resultRaw.items[0].added_lines?.items ?? 0,
        lines: resultRaw.items[0].lines?.items ?? 0,
        subtotal,
        error: undefined
    };
}

export default calculateOrder;
