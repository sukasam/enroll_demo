import {
    Event,
    checkProperties,
    pushEvent
} from "Services/googleAnalytics/index";

type Data = { fieldName: string };

export default function handler(
    event: Event["event"],
    { fieldName }: Data
): void {
    if (!checkProperties(fieldName)) {
        throw new Error("Missing required property!");
    }

    pushEvent(event, {
        field_name: fieldName
    });
}
