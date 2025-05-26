import { Alpha2 } from "Constants/countryConfig/enums";
import {
    Event,
    checkProperties,
    pushEvent
} from "Services/googleAnalytics/index";

type Data = {
    country: Alpha2;
    language: string;
};

export default function handler(
    event: Event["event"],
    { country, language }: Data
): void {
    if (!checkProperties(country, language)) {
        throw new Error("Missing required property!");
    }

    pushEvent(event, {
        user_country: country,
        user_language: language
    });
}
