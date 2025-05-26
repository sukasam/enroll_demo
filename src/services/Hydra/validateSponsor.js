import httpTools from "Shared/httpTools.js";

export const validateSponsor = ({ enroller, sponsor }) => {
    const req = {
        method: "POST",
        url: "/orders/dryrun",
        withAuth: false,
        data: {
            customer: {
                enroller: {
                    href: `${httpTools.envUrl()}/customers?id.unicity=${enroller}`
                },
                sponsor: {
                    href: `${httpTools.envUrl()}/customers?id.unicity=${sponsor}`
                }
            }
        }
    };

    return httpTools.sendRequest(req);
};
export default validateSponsor;
