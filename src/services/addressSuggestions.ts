/* eslint-disable camelcase */
import { Alpha2 } from "Constants/countryConfig/enums";
import { toAlpha3 } from "./locale";

const apiPublicKey = process.env.NEXT_PUBLIC_SMARTY_API_KEY;

const usAPI = "https://us-autocomplete-pro.api.smartystreets.com/lookup";
const internationalAPI =
    "https://international-autocomplete.api.smartystreets.com/v2/lookup";

export interface AddressSuggestion {
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

interface SuggestionContext {
    administrativeArea?: string;
    city?: string;
    postalCode?: string;
    address_id?: string;
}

interface USCandidate {
    street_line: string;
    secondary: string;
    city: string;
    state: string;
    zipcode: string;
}

interface InternationalCandidateSummary {
    entries: number;
    address_id: string;
    address_text: string;
    zipcode: string;
}

export default async function getAddressSuggestions(
    query: string,
    alpha2: Alpha2,
    context: SuggestionContext = {},
    limit = 5
): Promise<AddressSuggestion[]> {
    if (!query) {
        return [];
    }

    let api;

    const upperAlpha = toAlpha3(alpha2);

    const params = new URLSearchParams();

    params.set("key", apiPublicKey || "");

    if (upperAlpha === "USA" || upperAlpha === "PRI") {
        api = usAPI;

        if (context.administrativeArea) {
            params.set("include_only_states", context.administrativeArea);
        }

        if (context.city) {
            params.set("include_only_cities", context.city);
        }

        if (context.postalCode) {
            params.set("include_only_zip_codes", context.postalCode);
        }
    } else {
        api = internationalAPI;

        params.set("country", upperAlpha);

        if (context.administrativeArea) {
            params.set(
                "include_only_administrative_area",
                context.administrativeArea
            );
        }

        if (context.city) {
            params.set("include_only_locality", context.city);
        }

        if (context.postalCode) {
            params.set("include_only_postal_code", context.postalCode);
        }
    }

    params.set("search", query);

    params.set("max_results", `${limit}`);

    const result = await fetch(`${api}?${params}`);

    const json = await result.json();

    if (api === internationalAPI) {
        return (json.candidates as InternationalCandidateSummary[]).map(
            (candidate: InternationalCandidateSummary) => ({
                address1: candidate.address_text,
                address2: "",
                city: "",
                state: "",
                zip: candidate.zipcode || "",
                country: "",
                addressId: candidate.address_id,
                entries: candidate.entries
            })
        );
    }
    return (
        (json.candidates || json.suggestions)?.map(
            (candidate: USCandidate & Record<string, never>) => ({
                address1: candidate.street_line || "",
                address2: candidate.secondary || "",
                city: candidate.city || "",
                state: candidate.state?.toUpperCase() || "",
                zip: candidate.zipcode || "",
                country: upperAlpha || ""
            })
        ) || []
    );
}
export async function getAddressById(
    addressId: string,
    country: Alpha2
): Promise<AddressSuggestion[] | null> {
    const params = new URLSearchParams({
        key: apiPublicKey || "",
        country: toAlpha3(country)
    });

    const result = await fetch(`${internationalAPI}/${addressId}?${params}`);
    const json = await result.json();

    if (json.candidates && json.candidates.length > 0) {
        if ("address_text" in json.candidates[0]) {
            return json.candidates
                .slice(0, 5)
                .map((candidate: Record<string, string>) => ({
                    address1: candidate.address_text || "",
                    address2: "",
                    city: "",
                    state: "",
                    zip: "",
                    country: "",
                    addressId: candidate.address_id,
                    entries: candidate.entries
                }));
        }
        return json.candidates
            .slice(0, 5)
            .map((candidate: Record<string, string>) => ({
                address1: candidate.street || "",
                address2: candidate.secondary || "",
                city: candidate.locality || "",
                state: candidate.administrative_area || "",
                zip: candidate.postal_code || "",
                country: candidate.country_iso3 || ""
            }));
    }

    return null;
}
