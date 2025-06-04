import { Alpha2 } from "Constants/countryConfig/enums";
import PhoneNumberField from "../PhoneNumberField";
import TextField from "../TextField";

interface MapFieldToComponentProps {
    field: string;
    validationRules: any;
    translate: (key: string, params?: Record<string, any>) => string;
    country: string;
    errors: Record<string, any>;
    control: any;
    disabled?: boolean;
    type?: string;
}

const mapFieldToComponent = ({
    field,
    validationRules,
    translate,
    country,
    errors,
    control,
    disabled,
    type
}: MapFieldToComponentProps): JSX.Element | null => {
    switch (field) {
        case "firstName":
            return (
                <TextField
                    key="firstName"
                    label={translate("create_account_first_name")}
                    name="firstName"
                    rules={
                        type === "create"
                            ? {
                                  ...validationRules.firstName,
                                  validate: (value: string) =>
                                      validationRules.firstName.validate(
                                          value,
                                          country
                                      )
                              }
                            : {
                                  ...validationRules.firstName
                              }
                    }
                    type="text"
                    data-testid="create_account_first_name"
                    disabled={disabled}
                />
            );
        case "lastName":
            return (
                <TextField
                    key="lastName"
                    label={translate("create_account_last_name")}
                    name="lastName"
                    rules={
                        type === "create"
                            ? {
                                  ...validationRules.lastName,
                                  validate: (value: string) =>
                                      validationRules.lastName.validate(
                                          value,
                                          country
                                      )
                              }
                            : {
                                  ...validationRules.lastName
                              }
                    }
                    type="text"
                    data-testid="create_account_last_name"
                    disabled={disabled}
                />
            );
        case "fullName":
            return (
                <TextField
                    key="fullName"
                    label={translate("create_account_full_name")}
                    name="fullName"
                    rules={
                        type === "create"
                            ? {
                                  ...validationRules.fullName,
                                  validate: (value: string) =>
                                      validationRules.fullName.validate(
                                          value,
                                          country
                                      )
                              }
                            : {
                                  ...validationRules.fullName
                              }
                    }
                    type="text"
                    data-testid="create_account_full_name"
                    disabled={disabled}
                />
            );
        case "fullNameEn":
            return (
                <TextField
                    key="fullNameEn"
                    label={translate("create_account_full_name_en")}
                    name="fullNameEn"
                    rules={
                        type === "create"
                            ? {
                                  ...validationRules.fullNameEn,
                                  validate: (value: string) =>
                                      validationRules.fullNameEn.validate(
                                          value,
                                          country
                                      )
                              }
                            : {
                                  ...validationRules.fullNameEn
                              }
                    }
                    type="text"
                    data-testid="create_account_full_name_en"
                    disabled={disabled}
                />
            );
        case "phoneNumber":
            return (
                <PhoneNumberField
                    key="phoneNumber"
                    className="phoneNumberField"
                    label={translate("create_account_phone_number")}
                    name="phoneNumber"
                    rules={validationRules.phoneNumber}
                    defaultCountry={country as Alpha2}
                    error={translate(errors.phoneNumber?.message)}
                    control={control}
                    data-testid="create_account_phone_number"
                />
            );
        case "email":
            return (
                <TextField
                    key="email"
                    label={translate("create_account_email_address")}
                    name="email"
                    rules={validationRules.email}
                    type="text"
                    data-testid="create_account_email_address"
                    disabled={disabled}
                />
            );
        case "password":
            return (
                <TextField
                    key="password"
                    label={translate("create_account_password")}
                    name="password"
                    rules={validationRules.password}
                    type="password"
                    data-testid="create_account_password"
                    className="passwordField"
                />
            );
        default:
            return null;
    }
};

export default mapFieldToComponent;
