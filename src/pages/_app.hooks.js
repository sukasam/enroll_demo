import { useUser } from "Contexts/UserContext";
import { getCookie, setCookie } from "cookies-next";
import { useEffect } from "react";
import isClient from "Services/utils/isClient";
export function useEnroller() {
    const refIdCookie = getCookie("refId");

    const { enrollerId, setEnrollerId } = useUser();

    useEffect(() => {
        if (enrollerId && window?._mfq?.push) {
            window._mfq.push(["setVariable", "enrollerID", enrollerId]);
        }
    }, [enrollerId]);

    useEffect(() => {
        if (!refIdCookie) {
            return;
        }

        if (refIdCookie && !enrollerId) {
            setEnrollerId(refIdCookie);
        }
    }, [enrollerId]);
}

export const useInitialReferrer = () => {
    useEffect(() => {
        if (!isClient()) return;
        const initialReferrer = getCookie("initial_referrer");

        if (!initialReferrer) {
            setCookie("initial_referrer", document.referrer || "$direct", {
                maxAge: 60 * 60 * 24 * 365,
                path: "/"
            });
            const referringDomain = document.referrer
                ? new URL(document.referrer).host
                : "$direct";

            setCookie("initial_referring_domain", referringDomain, {
                maxAge: 60 * 60 * 24 * 365,
                path: "/"
            });
        }
    }, []);
};

export function getGA4SessionId() {
    const cookieName = "_ga_JJRMGSE4DH";
    const cookieValue = document.cookie
        .split("; ")
        .find(row => row.startsWith(cookieName))
        ?.split("=")[1];

    if (!cookieValue) return null;

    const parts = cookieValue.split(".");
    const sessionNumber = parts[2];

    return sessionNumber;
}
