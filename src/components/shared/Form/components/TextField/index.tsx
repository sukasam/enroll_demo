/** @jsxImportSource @emotion/react */
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import { useTranslate } from "Components/shared/Translate";
import { useState } from "react";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";
import mixpanelService from "services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";
import styles from "./styles";

interface TextFieldProps<TFieldValues extends FieldValues>
    extends UseControllerProps<TFieldValues> {
    className?: string;
    label: string | JSX.Element;
    type: string;
    disabled?: boolean;
    hidden?: boolean;
    "data-testid"?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    capitalize?: boolean;
}

interface ValidationError {
    type: string;
    message?: string;
}

function TextField<TFieldValues extends FieldValues>({
    className,
    label,
    name,
    control,
    rules,
    type,
    disabled,
    hidden,
    "data-testid": dataTestId,
    onChange,
    capitalize = false
}: TextFieldProps<TFieldValues>): JSX.Element {
    const [showPassword, setShowPassword] = useState(false);
    const translate = useTranslate();
    const togglePasswordVisibility = (): void => setShowPassword(!showPassword);

    const getErrorMessage = (error: ValidationError): JSX.Element => {
        const errorMessageName = translate(error.message);
        const errorMessage = translate("error_is_required");

        if (error.type === "required") {
            return (
                <p className="error active">
                    {translate(errorMessage, { field: errorMessageName })}
                </p>
            );
        }

        const handleErrorLinkClick = async (): Promise<void> => {
            await mixpanelService.trackEvent(
                MixpanelEvent.REGISTRATION_ALREADY_HAVE_ACCOUNT_CLICKED,
                {
                    event_location: "email_validation_error"
                }
            );
            window.location.href = "/login";
        };

        const errorText = translate(error.message, { url: "/login" });

        const handleErrorClick = async (
            e:
                | React.MouseEvent<HTMLDivElement>
                | React.KeyboardEvent<HTMLDivElement>
        ): Promise<void> => {
            const target = e.target as HTMLElement;
            if (target.tagName === "A") {
                e.preventDefault();
                await handleErrorLinkClick();
            }
        };

        return (
            <div
                className="error active"
                onClick={handleErrorClick}
                onKeyDown={handleErrorClick}
                role="button"
                tabIndex={0}
                aria-label={errorText}
                dangerouslySetInnerHTML={{
                    __html: errorText.replace(
                        /<a\s/g,
                        '<a style="color: inherit;" role="link" tabindex="0"'
                    )
                }}
            />
        );
    };

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({
                field: { onChange: fieldOnChange, onBlur, value = "", ref },
                fieldState: { error }
            }): JSX.Element => (
                <div className={`formField ${className}`} css={styles}>
                    <label
                        htmlFor={name}
                        className="label"
                        data-testid={dataTestId}
                        hidden={hidden}
                    >
                        {translate(label)}
                    </label>
                    <div style={{ position: "relative" }}>
                        <input
                            className={`input ${error ? "invalid" : ""}`}
                            id={name}
                            type={
                                type === "password" && showPassword
                                    ? "text"
                                    : type
                            }
                            onChange={(e): void => {
                                if (capitalize)
                                    e.target.value =
                                        e.target.value.toUpperCase();
                                fieldOnChange(e);
                                if (onChange) onChange(e);
                            }}
                            onBlur={onBlur}
                            disabled={disabled}
                            value={value}
                            hidden={hidden}
                            ref={ref}
                        />
                        {disabled && (
                            <IconButton
                                aria-label="disabled"
                                className="locked-icon"
                                disabled
                                size="small"
                            >
                                <LockIcon />
                            </IconButton>
                        )}
                        {type === "password" && (
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={togglePasswordVisibility}
                                className="showPasswordButton"
                            >
                                {showPassword ? (
                                    <VisibilityOff />
                                ) : (
                                    <Visibility />
                                )}
                            </IconButton>
                        )}
                    </div>
                    {/* Always render error message area for consistent height */}
                    {error ? (
                        getErrorMessage(error as ValidationError)
                    ) : (
                        <p className="error">{"\u00A0"}</p>
                    )}
                </div>
            )}
        />
    );
}

export default TextField;
