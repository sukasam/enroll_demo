import getRefID, { Customer } from "Hydra/getRefID";

type IsRefValid = {
    isValid: boolean;
    unicityID: string;
    refResults: Customer | null;
};

function getRefProperties(ref: string): {
    isOnlyNumbers: boolean;
} {
    return {
        isOnlyNumbers: /^[0-9]+$/.test(ref)
    };
}

function isRefValidRegexTest(ref: string): boolean {
    const { isOnlyNumbers } = getRefProperties(ref);

    const minLength = isOnlyNumbers ? 6 : 3;
    if (ref?.length < minLength || ref?.length > 20) {
        return false;
    }
    return true;
}

async function getUserFromRefCode(ref: string): Promise<IsRefValid> {
    const result = await getRefID({
        country: "US",
        language: "en",
        refID: ref
    });

    const isValid = result?.ok ?? true;
    const unicityID = isValid ? String(result?.items?.[0]?.unicity || "") : "";
    const refResults: Customer | null =
        isValid && result?.items?.length === 1 ? result.items[0] : null;

    return { isValid, unicityID, refResults };
}

export default async function isRefValid(
    ref: string | undefined
): Promise<IsRefValid> {
    let results: IsRefValid = {
        isValid: false,
        unicityID: ref || "",
        refResults: null
    };

    if (!isRefValidRegexTest(results.unicityID))
        return { ...results, isValid: false };

    results = { ...results, ...(await getUserFromRefCode(results.unicityID)) };

    return results;
}
