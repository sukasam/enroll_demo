import httpTools from "Shared/httpTools.js";

const validateEnroller = ({ enroller }) => {
    const req = {
        method: "POST",
        url: "/orders/dryrun",
        withAuth: false,
        data: {
            customer: {
                enroller: {
                    href: `${httpTools.envUrl()}/customers?id.unicity=${enroller}`
                }
            }
        }
    };

    return httpTools.sendRequest(req);
};
export default validateEnroller;
