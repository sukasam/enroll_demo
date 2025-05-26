/** @jsxImportSource @emotion/react */
import LockIcon from "@mui/icons-material/Lock";
import {
    FormControl,
    IconButton,
    InputAdornment,
    MenuItem,
    Select
} from "@mui/material";
import { useTranslations } from "Contexts/translation";
import dynamic from "next/dynamic";
import { Controller, useFormContext } from "react-hook-form";
import styles from "./styles";

const Flag = dynamic(() => import("react-world-flags"), { ssr: false });

interface Option {
    label: string;
    value: string | number;
}

interface SelectDropdownProps {
    name: string;
    label: string;
    options: Option[];
    defaultValue?: string | number;
    disabled?: boolean;
    rules?: object;
    onChange?: (value: string | number) => void;
    className?: string;
    value?: string | number;
    "data-testid"?: string;
}

function LockedIconComponent(): React.ReactElement {
    return (
        <IconButton size="small" edge="end" disabled className="locked-icon">
            <LockIcon fontSize="small" />
        </IconButton>
    );
}

function SelectDropdown({
    name,
    label,
    options,
    disabled,
    rules,
    onChange,
    className,
    value,
    defaultValue,
    "data-testid": dataTestId
}: SelectDropdownProps): React.ReactElement {
    const { control } = useFormContext();
    const isCountry = name === "country";
    const { country } = useTranslations();
    return (
        <div className={className} data-testid={dataTestId}>
            <FormControl css={styles} fullWidth>
                <label className="label">{label}</label>
                <Controller
                    name={name}
                    control={control}
                    rules={rules}
                    defaultValue={defaultValue || country}
                    render={({ field }): React.ReactElement => (
                        <Select
                            defaultValue={defaultValue || country}
                            className="select"
                            {...field}
                            disabled={disabled}
                            IconComponent={
                                disabled ? LockedIconComponent : undefined
                            }
                            startAdornment={
                                isCountry && (
                                    <InputAdornment
                                        className="flag-icon"
                                        position="start"
                                        data-testid="flag_icon"
                                    >
                                        <Flag
                                            height={24}
                                            width={24}
                                            code={field.value}
                                        />
                                    </InputAdornment>
                                )
                            }
                            onChange={(e): void => {
                                field.onChange(e.target.value);
                                onChange?.(e.target.value);
                            }}
                            value={value}
                        >
                            {options.map(option => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                />
            </FormControl>
        </div>
    );
}

export default SelectDropdown;
