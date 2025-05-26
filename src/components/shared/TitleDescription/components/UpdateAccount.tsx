import { useTranslate } from "Components/shared/Translate";
import { useTranslations } from "Contexts/translation";
import { useUser } from "Contexts/UserContext";

const formatDisplayName = (
    firstName: string | undefined,
    lastName: string | undefined,
    country: string,
    language: string
): string => {
    if (!firstName || !lastName) return "";

    if (country === "JP") {
        return language === "ja" ? firstName : lastName;
    }

    return `${firstName} ${lastName}`;
};

// Account: {UserFirstName} {UserLastName}, {userEmail}
export default function UpdateAccount(): JSX.Element | null {
    const { userData } = useUser();
    const translate = useTranslate();
    const { country, language } = useTranslations();

    const displayName = formatDisplayName(
        userData?.firstName,
        userData?.lastName,
        country,
        language
    );

    if (!userData?.firstName || !userData?.lastName || !userData?.email) {
        return null;
    }

    return (
        <div>
            {displayName}, {userData?.email}
            <br />
            {translate("create_account_unicity_id")} {userData?.unicityId}
        </div>
    );
}
