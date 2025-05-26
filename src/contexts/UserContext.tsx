import { dismissAllErrorToasts } from "Components/shared/ShowToaster";
import { AddressType } from "Contexts/types/OrderContextTypes";
import { UserContextState, UserData } from "Contexts/types/UserContextTypes";
import { useRouter } from "next/router";
import {
    ReactElement,
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import useLoginHooks from "./hooks/LoginHooks";

const defaultState: UserContextState = {
    userToken: null,
    setUserToken: () => null,
    enrollerId: null,
    setEnrollerId: () => null,
    sponsorId: null,
    setSponsorId: () => null,
    userData: null,
    setUserData: () => null,
    enrollerFullName: null,
    setEnrollerFullName: () => null,
    sponsorFullName: null,
    setSponsorFullName: () => null,
    enrollerAllFullName: null,
    setEnrollerAllFullName: () => null,
    isLoggedIn: false,
    setIsLoggedIn: () => null,
    href: null,
    setHref: () => null,
    userLocale: null,
    setUserLocale: () => null,
    isUserContextLoading: true,
    setIsUserContextLoading: () => null,
    activeAccordionSection: null,
    setActiveAccordionSection: () => null,
    goToNextSection: () => null,
    setLoggedInData: () => null,
    mainAddress: null as AddressType | null, // Update type
    setMainAddress: () => null,
    deleteAuthCookie: () => null,
    resetBacktoDefault: () => null
};

const UserContext = createContext<UserContextState>(defaultState);

export function UserProvider({
    children,
    testValues
}: {
    children: ReactNode;
    testValues?: Record<string, string>;
}): ReactElement {
    const [userToken, setUserToken] = useState<string | null>(
        defaultState.userToken
    );
    const [enrollerId, setEnrollerId] = useState<string | null>(
        defaultState.enrollerId
    );
    const [sponsorId, setSponsorId] = useState<string | null>(
        defaultState.sponsorId
    );
    const [userData, setUserData] = useState<UserData | null>(
        defaultState.userData
    );
    const [enrollerFullName, setEnrollerFullName] = useState<string | null>(
        defaultState.enrollerFullName
    );
    const [sponsorFullName, setSponsorFullName] = useState<string | null>(
        defaultState.sponsorFullName
    );
    const [enrollerAllFullName, setEnrollerAllFullName] = useState<any | null>(
        defaultState.enrollerAllFullName
    );
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
        defaultState.isLoggedIn
    );
    const [href, setHref] = useState<string | null>(defaultState.href);
    const [userLocale, setUserLocale] = useState<string | null>(
        defaultState.userLocale
    );
    const [isUserContextLoading, setIsUserContextLoading] = useState<boolean>(
        defaultState.isUserContextLoading
    );
    const [activeAccordionSection, setActiveAccordionSection] = useState<
        number | null
    >(defaultState.activeAccordionSection);
    const [mainAddress, setMainAddress] = useState<AddressType | null>(
        defaultState.mainAddress
    );

    const router = useRouter();
    const {
        getUserTokenFromCookie,
        setAuthCookie,
        deleteAuthCookie: _deleteAuthCookie,
        setLoggedInData: _setLoggedInData
    } = useLoginHooks();

    const resetBacktoDefault = useCallback(() => {
        setUserToken(defaultState.userToken);
        setEnrollerId(defaultState.enrollerId);
        setSponsorId(defaultState.sponsorId);
        setUserData(defaultState.userData);
        setEnrollerFullName(defaultState.enrollerFullName);
        setSponsorFullName(defaultState.sponsorFullName);
        setEnrollerAllFullName(defaultState.enrollerAllFullName);
        setIsLoggedIn(defaultState.isLoggedIn);
        setHref(defaultState.href);
        setUserLocale(defaultState.userLocale);
        setIsUserContextLoading(defaultState.isUserContextLoading);
        setActiveAccordionSection(defaultState.activeAccordionSection);
        setMainAddress(defaultState.mainAddress);
    }, [
        setUserToken,
        setEnrollerId,
        setSponsorId,
        setUserData,
        setEnrollerFullName,
        setSponsorFullName,
        setEnrollerAllFullName,
        setIsLoggedIn,
        setHref,
        setUserLocale,
        setIsUserContextLoading,
        setActiveAccordionSection,
        setMainAddress
    ]);

    const deleteAuthCookie = useCallback(() => {
        _deleteAuthCookie();
        resetBacktoDefault();
    }, [_deleteAuthCookie, resetBacktoDefault]);

    const setLoggedInData = useCallback(
        async (token: string): Promise<void> => {
            try {
                await _setLoggedInData({
                    userToken: token,
                    setUserData,
                    setHref,
                    setUserToken,
                    setEnrollerFullName,
                    setSponsorFullName,
                    setEnrollerId,
                    setSponsorId,
                    setMainAddress
                });
            } catch (error) {
                deleteAuthCookie();
                resetBacktoDefault();
                throw error;
            }
        },
        [
            _setLoggedInData,
            setUserData,
            setHref,
            setUserToken,
            setEnrollerFullName,
            setSponsorFullName,
            setEnrollerId,
            setSponsorId,
            setMainAddress,
            resetBacktoDefault
        ]
    );

    useEffect(() => {
        setIsLoggedIn(!!userToken);
        setIsUserContextLoading(false);
    }, [userToken]);

    const loadCachedUserData = async (): Promise<void> => {
        setIsUserContextLoading(true);
        const _userToken = getUserTokenFromCookie();
        setUserToken(_userToken);

        const cachedData = sessionStorage.getItem("userContext");
        if (cachedData) {
            try {
                const parsedData: UserContextState = JSON.parse(cachedData);

                setEnrollerId(parsedData.enrollerId);
                setSponsorId(parsedData.sponsorId);
                setUserData(parsedData.userData);
                setEnrollerFullName(parsedData.enrollerFullName);
                setSponsorFullName(parsedData.sponsorFullName);
                setEnrollerAllFullName(parsedData.enrollerAllFullName);
                setIsLoggedIn(!!_userToken);
                setHref(parsedData.href);
                setUserLocale(parsedData.userLocale);
                setMainAddress(parsedData.mainAddress);

                if (!parsedData.href && _userToken) {
                    await setLoggedInData(_userToken);
                }
            } catch (error) {
                console.error(
                    "Failed to parse user context data from sessionStorage:",
                    error
                );
            }
        }
        setIsUserContextLoading(false);
    };

    useEffect(() => {
        if (router.pathname !== "/logout" && router.pathname !== "/reset")
            loadCachedUserData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateCachedUserData = useCallback((): void => {
        setAuthCookie(userToken);
        const dataToCache = {
            enrollerId,
            sponsorId,
            userData,
            enrollerFullName,
            sponsorFullName,
            enrollerAllFullName,
            isLoggedIn,
            href,
            userLocale,
            activeAccordionSection,
            mainAddress
        };
        sessionStorage.setItem("userContext", JSON.stringify(dataToCache));
    }, [
        setAuthCookie,
        userToken,
        enrollerId,
        sponsorId,
        userData,
        enrollerFullName,
        sponsorFullName,
        enrollerAllFullName,
        isLoggedIn,
        href,
        userLocale,
        activeAccordionSection,
        mainAddress
    ]);

    useEffect(() => {
        updateCachedUserData();
    }, [updateCachedUserData]);

    const goToNextSection = useCallback(() => {
        dismissAllErrorToasts();
        setActiveAccordionSection(prevSection =>
            prevSection !== null ? prevSection + 1 : 1
        );
    }, [setActiveAccordionSection]);

    const value = useMemo(
        () => ({
            userToken,
            setUserToken,
            enrollerId,
            setEnrollerId,
            sponsorId,
            setSponsorId,
            userData,
            setUserData,
            enrollerFullName,
            setEnrollerFullName,
            sponsorFullName,
            setSponsorFullName,
            enrollerAllFullName,
            setEnrollerAllFullName,
            isLoggedIn,
            setIsLoggedIn,
            href,
            setHref,
            userLocale,
            setUserLocale,
            isUserContextLoading,
            setIsUserContextLoading,
            activeAccordionSection,
            setActiveAccordionSection,
            goToNextSection,
            setLoggedInData,
            mainAddress,
            setMainAddress,
            deleteAuthCookie,
            resetBacktoDefault
        }),
        [
            userToken,
            enrollerId,
            sponsorId,
            userData,
            enrollerFullName,
            sponsorFullName,
            enrollerAllFullName,
            isLoggedIn,
            href,
            userLocale,
            isUserContextLoading,
            activeAccordionSection,
            goToNextSection,
            setLoggedInData,
            mainAddress,
            setMainAddress,
            deleteAuthCookie,
            resetBacktoDefault
        ]
    );

    const providerValue = useMemo(
        () => ({
            ...value,
            ...testValues
        }),
        [value, testValues]
    );

    return (
        <UserContext.Provider value={providerValue}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = (): UserContextState => useContext(UserContext);
