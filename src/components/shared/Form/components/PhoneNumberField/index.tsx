/** @jsxImportSource @emotion/react */
import { Alpha2 } from "Constants/countryConfig/enums";
import { Controller } from "react-hook-form";
import PhoneInput, { Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import styles from "./styles";

interface PhoneNumberFieldProps {
    label: string;
    control: any;
    error: any;
    name: string;
    rules: object;
    defaultCountry?: Alpha2;
    className?: string;
}

const toCountryCode = (alpha2: Alpha2): Country => alpha2 as unknown as Country;

function PhoneNumberField({
    label,
    control,
    error,
    name,
    rules,
    defaultCountry,
    className,
    ...rest
}: PhoneNumberFieldProps): JSX.Element {
    return (
        <div className={`formField ${className}`} {...rest} css={styles}>
            <label htmlFor={name} className="label">
                {label}
            </label>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({
                    field: { onChange, onBlur, value, ref }
                }): React.ReactElement => (
                    <PhoneInput
                        international
                        countryCallingCodeEditable={false}
                        defaultCountry={toCountryCode(
                            defaultCountry || Alpha2.US
                        )}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        inputRef={ref}
                        className={`input ${error ? "invalid" : ""}`}
                    />
                )}
            />
            <p className={`error ${error ? "active" : ""}`}>
                {error || "\u00A0"}
            </p>
        </div>
    );
}

export default PhoneNumberField;
