import { useTranslate } from "Components/shared/Translate";
import { useEffect, useState } from "react";

interface PasswordCriteria {
    minLength: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    specialChar: boolean;
}

interface PasswordRequirementsProps {
    password: string;
    touchedFields: { password?: boolean };
}

function PasswordRequirements({
    password,
    touchedFields
}: PasswordRequirementsProps): JSX.Element {
    const translate = useTranslate();
    const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteria>({
        minLength: false,
        lowercase: false,
        uppercase: false,
        number: false,
        specialChar: false
    });

    useEffect(() => {
        const newPasswordCriteria: PasswordCriteria = {
            minLength: password?.length >= 8,
            lowercase: password ? /[a-z]/.test(password) : false,
            uppercase: password ? /[A-Z]/.test(password) : false,
            number: password ? /[0-9]/.test(password) : false,
            specialChar: password
                ? /[!@#$%^&*(),.?":{}|<>]/.test(password)
                : false
        };
        setPasswordCriteria(newPasswordCriteria);
    }, [password]);

    const getClassName = (criteria: boolean): string => {
        if (criteria) return "valid";
        return touchedFields.password ? "invalid" : "initial";
    };

    return (
        <div className="passwordRequirements">
            <div
                className="passwordLabel"
                data-testid="create_account_password_must"
            >
                {translate("create_account_password_must")}
            </div>
            <ul>
                <li
                    className={getClassName(passwordCriteria.minLength)}
                    data-testid="create_account_password_requirement_1"
                >
                    {translate("create_account_password_requirement_1")}
                </li>
                <li
                    className={getClassName(passwordCriteria.lowercase)}
                    data-testid="create_account_password_requirement_2"
                >
                    {translate("create_account_password_requirement_2")}
                </li>
                <li
                    className={getClassName(passwordCriteria.uppercase)}
                    data-testid="create_account_password_requirement_3"
                >
                    {translate("create_account_password_requirement_3")}
                </li>
                <li
                    className={getClassName(passwordCriteria.number)}
                    data-testid="create_account_password_requirement_4"
                >
                    {translate("create_account_password_requirement_4")}
                </li>
                <li
                    className={getClassName(passwordCriteria.specialChar)}
                    data-testid="create_account_password_requirement_5"
                >
                    {translate("create_account_password_requirement_5")}
                </li>
            </ul>
        </div>
    );
}

export default PasswordRequirements;
