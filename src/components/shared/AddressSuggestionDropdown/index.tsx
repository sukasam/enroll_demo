/** @jsxImportSource @emotion/react */
import { ChevronRight } from "@mui/icons-material";
import { Popper } from "@mui/material";
import { Alpha2, Alpha3 } from "Constants/countryConfig/enums.js";
import { AddressSuggestion, getAddressById } from "Services/addressSuggestions";
import { toAlpha2 } from "Services/locale";
import { useCallback, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import useOnClickOutside from "./hook";
import styles from "./styles.js";

type AddressSuggestionDropdownProps = {
    suggestedAddresses: Array<AddressSuggestion>;
    selectedCountry: string;
    setSuggestedAddresses: (addresses: Array<AddressSuggestion>) => void;
    setHintsOpen: (open: boolean) => void;
    hintsOpen: boolean;
    anchorEl: HTMLElement | null;
    setLastAddressDebounce: (address: string) => void;
    onSuggestionSelect?: () => void;
};
export default function AddressSuggestionDropdown({
    suggestedAddresses,
    selectedCountry,
    setSuggestedAddresses,
    setHintsOpen,
    hintsOpen,
    anchorEl,
    setLastAddressDebounce,
    onSuggestionSelect
}: AddressSuggestionDropdownProps): React.ReactElement {
    const popperRef = useRef(null);

    const closeHints = useCallback((): void => {
        setSuggestedAddresses([]);
        setHintsOpen(false);
    }, [setSuggestedAddresses, setHintsOpen]);

    useOnClickOutside(popperRef, () => closeHints());

    const { setValue, watch } = useFormContext();
    const country = watch("country");

    useEffect(() => {
        closeHints();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [country]);

    const fillForm = (suggestedAddress: AddressSuggestion): void => {
        const fieldsToUpdate = [
            { name: "address1", value: suggestedAddress.address1 },
            {
                name: "address2",
                value:
                    country === "JP"
                        ? suggestedAddress.city
                        : suggestedAddress.address2
            },
            { name: "city", value: suggestedAddress.city },
            { name: "state", value: suggestedAddress.state },
            { name: "zip", value: suggestedAddress.zip },
            {
                name: "country",
                value: toAlpha2(suggestedAddress.country as Alpha3)
            }
        ];
        fieldsToUpdate.forEach(({ name, value }) => {
            setValue(name, value, { shouldTouch: true, shouldValidate: true });
        });
    };

    const handleSelectAddress = async (
        event: React.MouseEvent | React.KeyboardEvent,
        address: Record<string, any>
    ): Promise<void> => {
        if (
            event.type === "keydown" &&
            (event as React.KeyboardEvent).key !== "Enter" &&
            (event as React.KeyboardEvent).key !== " "
        ) {
            return;
        }

        if (
            address.entries &&
            address.entries >= 1 &&
            address.addressId !== undefined
        ) {
            const newSuggestion = await getAddressById(
                address.addressId,
                (selectedCountry as Alpha2) || "US"
            );
            if (newSuggestion) {
                setSuggestedAddresses(newSuggestion);
                return;
            }
        }
        fillForm(address as AddressSuggestion);
        setLastAddressDebounce(address.address1);
        closeHints();
        onSuggestionSelect?.();
    };

    return (
        <Popper
            ref={popperRef}
            anchorEl={anchorEl}
            css={styles}
            id="address-hints"
            open={hintsOpen}
            placement="bottom-start"
            popperOptions={{
                modifiers: [
                    {
                        name: "offset",
                        options: {
                            offset: [0, 0]
                        }
                    }
                ]
            }}
            style={{ zIndex: 9 }}
        >
            <div className="dropdown">
                {suggestedAddresses.map((address: Record<string, any>) => (
                    <div
                        className="option"
                        key={`${address.address1}-${address.city}-${address.state}-${address.zip}`}
                        role="button"
                        tabIndex={0}
                        onClick={(event): Promise<void> =>
                            handleSelectAddress(event, address)
                        }
                        onKeyDown={(event): Promise<void> =>
                            handleSelectAddress(event, address)
                        }
                    >
                        {address.addressId ? (
                            <div className="addressSuggestion">
                                <div className="address">
                                    {address.address1}
                                </div>
                                <div className="more">
                                    More <ChevronRight />
                                </div>
                            </div>
                        ) : (
                            `${address.address1} ${address.city} ${address.state} ${address.zip}`
                        )}
                    </div>
                ))}
            </div>
        </Popper>
    );
}
