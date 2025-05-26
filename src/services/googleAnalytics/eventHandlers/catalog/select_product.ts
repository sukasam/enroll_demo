import {
    Event,
    checkProperties,
    pushEvent
} from "Services/googleAnalytics/index";

type Data = { sku: string; automatic: boolean };

export default function handler(
    event: Event["event"],
    { sku, automatic }: Data
): void {
    if (!checkProperties(sku, automatic)) {
        throw new Error("Missing required property!");
    }

    pushEvent(event, {
        sku,
        automatic
    });
}
