/** @jsxImportSource @emotion/react */
import Spinner from "Components/shared/Spinner";
import T from "Components/shared/Translate";
import { useUser } from "Contexts/UserContext";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import styles from "./styles";

export default function ReferralBar() {
    const [fullName, setFullName] = useState("");
    const { enrollerFullName, enrollerAllFullName } = useUser();
    const language = getCookie("language");

    useEffect(() => {
        if (enrollerAllFullName && typeof enrollerAllFullName === "object") {
            const fullName =
                enrollerAllFullName[`fullName@${language}`] || enrollerFullName;
            setFullName(fullName);
        } else {
            setFullName(enrollerFullName);
        }
    }, [language, enrollerFullName, enrollerAllFullName]);

    return (
        <div suppressHydrationWarning>
            {typeof window !== "undefined" ? (
                <div css={styles}>
                    <div className="ref-bar-main" suppressHydrationWarning>
                        <span className="ref-success">
                            {fullName ? (
                                <>
                                    <span data-testid="referral_bar_text">
                                        <T>create_account_referred_by</T>
                                    </span>{" "}
                                    <strong data-testid="referral_bar_enroller_name">
                                        {fullName}
                                    </strong>{" "}
                                </>
                            ) : (
                                <Spinner height="24px" />
                            )}
                        </span>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
