import { HumanName } from "services/Hydra/order/types";

export const getFullName = (humanName?: HumanName): string => {
    if (humanName && typeof humanName === "object") {
        if (humanName.firstName?.trim() && humanName.lastName?.trim()) {
            return `${humanName.firstName.trim()} ${humanName.lastName.trim()}`;
        }

        if (humanName.fullName?.trim()) {
            return humanName.fullName.trim();
        }
    }
    return "";
};

export const getFirstValidFullName = (
    humanNames: Array<HumanName | undefined> = []
): string => {
    if (!humanNames.length) return "";

    const foundName = humanNames.find(humanName => getFullName(humanName));
    return foundName ? getFullName(foundName) : "";
};
