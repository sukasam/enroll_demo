import { Alpha2 } from "Constants/countryConfig/enums";
import {
    Event,
    checkProperties,
    pushEvent
} from "Services/googleAnalytics/index";

type Data = { country: Alpha2 };

export default function handler(
    event: Event["event"],
    { country }: Data
): void {
    if (!checkProperties(country)) {
        throw new Error("Missing required property!");
    }

    pushEvent(event, {
        country
    });
}
