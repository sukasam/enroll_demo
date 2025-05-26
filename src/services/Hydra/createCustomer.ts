import pjson from "Root/package.json";
import httpTools from "Shared/httpTools.js";
import getPlatform from "Utils/getPlatform";

export type CustomerDataType = {
    mainAddress: { country: string };
    humanName: { firstName: string; lastName: string; "firstName@ja"?: string };
    password: { value: string };
    signature: { value: string | null };
    email: string;
    mobilePhone: string;
    type: string;
    businessEntity: { legalType: string };
    recaptchaToken: string | null;
    recaptchaType: string;
    rights?: { holder: string; type: string }[];
    programEnrollments?: string[];
};

const createCustomer = (
    customerData: CustomerDataType,
    enrollerId: string | null,
    sponsorId?: string | null
): Promise<any> => {
    const envUrl = httpTools.envUrl();
    const req = {
        method: "POST",
        url: "/customers",
        headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            "x-enable-recaptcha": "true"
        },
        withAuth: false,
        data: {
            ...customerData,
            enroller: {
                href: `${envUrl}/customers?id.unicity=${enrollerId}`,
                href_params: [`id.unicity=${enrollerId}`]
            },
            ...(sponsorId && {
                sponsor: {
                    href: `${envUrl}/customers?id.unicity=${sponsorId}`,
                    href_params: [`id.unicity=${sponsorId}`]
                }
            }),
            source: {
                medium: "Internet",
                agent: "Enroll2",
                version: pjson.version,
                platform: getPlatform(),
                market: customerData?.mainAddress?.country
            }
        },
        throwError: true,
        isErrorMessageOverride: true,
        logOptions: {
            requestName: "Create Account",
            error: true,
            functionName: "createCustomer"
        }
    };
    return httpTools.sendRequest(req);
};

export default createCustomer;
