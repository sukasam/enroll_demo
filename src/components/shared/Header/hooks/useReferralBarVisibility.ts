import { useUser } from "Contexts/UserContext";
import { useEffect, useState } from "react";

export default function useReferralBarVisibility(
    referralBar: boolean
): boolean {
    const { enrollerId } = useUser();
    const [showReferralBar, setShowReferralBar] = useState(false);

    useEffect(() => {
        setShowReferralBar(Boolean(enrollerId && referralBar));
    }, [enrollerId, referralBar]);

    return showReferralBar;
}
