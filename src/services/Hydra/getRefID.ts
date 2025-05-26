import { Alpha2 } from "Constants/countryConfig/enums";
import httpTools from "Shared/httpTools";

export type Customer = {
    humanName: {
        firstName: string;
        lastName: string;
        fullName: string;
        "fullName@fr": string;
    };
    preferredName?: {
        firstName: string;
        lastName: string;
    };
    mainAddress: {
        country: string;
    };
    unicity: number;
    market: Alpha2;
    href: string;
    customerSite: {
        href: string;
    };
    id: {
        unicity: string;
    };
    profilePicture: {
        href: string;
    };
    businessEntity: {
        companyName: string;
        legalType: string;
    };
    joinDate: string;
    status: string;
    type: string;
    entryPeriod: string;
    referralCode: string;
    subscriptions: {
        type: string;
        endDate: string;
    };
};

export type Response = {
    items?: Customer[];
    ok?: boolean;
};

type GetRefIDParams = {
    country: string;
    language: string;
    refID: string;
};

const getRefID = ({
    country,
    language,
    refID
}: GetRefIDParams): Promise<Response> => {
    const req = {
        method: "GET",
        url: `/customers?referralCode=${refID}&expand=customer,preferredName`,
        headers: {
            "Accept-Language": `${language}-${country}`
        },
        withAuth: false
    };
    return httpTools.sendRequest(req);
};

export default getRefID;
