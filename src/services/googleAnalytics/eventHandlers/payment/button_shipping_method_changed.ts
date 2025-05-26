import {
    Event,
    checkProperties,
    pushEvent
} from "Services/googleAnalytics/index";

type Data = { shippingMethod: string };

export default function handler(
    event: Event["event"],
    { shippingMethod }: Data
): void {
    if (!checkProperties(shippingMethod)) {
        throw new Error("Missing required property!");
    }

    pushEvent(event, {
        shipping_method: shippingMethod
    });
}
