import { AddressType } from "Contexts/types/OrderContextTypes";
import httpTools from "Shared/httpTools.js";

export type UserResponseType = {
    humanName: {
        firstName: string;
        lastName: string;
        fullName: string;
        "fullName@ja"?: string;
    };
    mainAddress: AddressType;
    unicity: number;
    market: string;
    href: string;
    id: {
        unicity: string;
    };
    preferredLocale: string;
    mobilePhone: string;
    email: string;
    type: string;
    enroller: {
        id: string;
        humanName: {
            fullName: string;
        };
    };
    joinDate: string;
    sponsor: {
        id: string;
        humanName: {
            fullName: string;
        };
    };
    ok?: boolean;
};

const getMe = async (hydraToken: string): Promise<UserResponseType> => {
    const req = {
        method: "GET",
        url: "/customers/me",
        token: hydraToken
    };

    return httpTools.sendRequest(req);
};

export default getMe;
