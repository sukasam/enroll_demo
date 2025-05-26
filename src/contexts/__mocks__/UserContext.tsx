import { AddressType } from "Contexts/types/OrderContextTypes";

export const useUser = jest.fn().mockReturnValue({
    userToken: null,
    setUserToken: jest.fn(),
    enrollerId: null,
    setEnrollerId: jest.fn(),
    sponsorId: null,
    setSponsorId: jest.fn(),
    userData: null,
    setUserData: jest.fn(),
    enrollerFullName: null,
    setEnrollerFullName: jest.fn(),
    sponsorFullName: null,
    setSponsorFullName: jest.fn(),
    isLoggedIn: false,
    setIsLoggedIn: jest.fn(),
    href: null,
    setHref: jest.fn(),
    userLocale: null,
    setUserLocale: jest.fn(),
    isUserContextLoading: false, // almost all test need this to be false vs just the loading test scenario
    setIsUserContextLoading: jest.fn(),
    activeAccordionSection: null,
    setActiveAccordionSection: jest.fn(),
    goToNextSection: jest.fn(),
    setLoggedInData: jest.fn(),
    mainAddress: null as AddressType | null,
    setMainAddress: jest.fn(),
    deleteAuthCookie: jest.fn(),
    resetBacktoDefault: jest.fn()
});

export default useUser;
