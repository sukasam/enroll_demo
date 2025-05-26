import httpTools from "Shared/httpTools";

const validateAddressWithQuotes = async ({
    sku,
    shippingMethod,
    city,
    country,
    state,
    address1,
    address2,
    zip
}) => {
    const adjustedCountry = country === "PR" ? "US" : country;

    const req = {
        method: "POST",
        data: {
            order: {
                customer: {
                    href: `${httpTools.envUrl()}/customers?type=Member`
                },
                lines: {
                    items: [
                        {
                            item: {
                                href: `${httpTools.envUrl()}/items?id.unicity=${sku}`
                            },
                            quantity: 1
                        }
                    ]
                },
                shipToAddress: {
                    city,
                    country: adjustedCountry,
                    state,
                    address1,
                    address2,
                    zip
                },
                shippingMethod: {
                    href: `${httpTools.envUrl()}/shippingmethods?type=${shippingMethod}`
                },
                market: adjustedCountry
            }
        },
        url: "/quotes",
        withAuth: false
    };

    const res = await httpTools.sendRequest(req);

    return res;
};

export default validateAddressWithQuotes;
