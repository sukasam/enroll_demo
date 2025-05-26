import { AddressType } from "./OrderContextTypes";

export type UserData = {
    firstName?: string;
    lastName?: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    unicityId: string;
};

export type UserContextState = {
    userToken: string | null;
    userData: UserData | null;
    href: string | null;
    enrollerId: string | null;
    sponsorId: string | null;
    enrollerFullName: string | null;
    sponsorFullName: string | null;
    enrollerAllFullName: any | null;
    isLoggedIn: boolean;
    userLocale: string | null;
    isUserContextLoading: boolean;
    activeAccordionSection: number | null;
    mainAddress: AddressType | null;
    setUserToken: (token: string | null) => void;
    setUserData: (data: UserData | null) => void;
    setHref: (href: string | null) => void;
    setEnrollerId: (id: string | null) => void;
    setSponsorId: (id: string | null) => void;
    setEnrollerFullName: (name: string | null) => void;
    setSponsorFullName: (name: string | null) => void;
    setEnrollerAllFullName: (name: any | null) => void;
    setIsLoggedIn: (loggedIn: boolean) => void;
    setUserLocale: (locale: string | null) => void;
    setIsUserContextLoading: (loading: boolean) => void;
    setActiveAccordionSection: (section: number | null) => void;
    goToNextSection: () => void;
    setLoggedInData: (token: string) => void;
    setMainAddress: (address: AddressType | null) => void;
    deleteAuthCookie: () => void;
    resetBacktoDefault: () => void;
};
