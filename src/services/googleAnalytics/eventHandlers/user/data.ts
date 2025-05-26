import { Alpha2 } from "Constants/countryConfig/enums";
import {
    Event,
    checkProperties,
    pushEvent
} from "Services/googleAnalytics/index";

type Data = {
    country: Alpha2;
    language: string;
    referralId: string;
    enrollerId: string;
    sponsorId: string;
    sponsorIsCustomize: boolean;
};

export default function handler(
    event: Event["event"],
    {
        country,
        language,
        referralId,
        enrollerId,
        sponsorId,
        sponsorIsCustomize
    }: Data
): void {
    if (!checkProperties(country, language)) {
        throw new Error("Missing required property!");
    }

    pushEvent(event, {
        user_country: country,
        user_language: language,
        referral_id: referralId ?? "",
        enroller_id: enrollerId ?? "",
        sponsor_id: sponsorId ?? "",
        sponsor_is_customize: sponsorIsCustomize ?? false
    });
}
