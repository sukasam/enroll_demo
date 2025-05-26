import {
    Event,
    checkProperties,
    pushEvent
} from "Services/googleAnalytics/index";

type Data = {
    shippingMethod: string;
    paymentMethod: string;
};

export default function handler(
    event: Event["event"],
    { shippingMethod, paymentMethod }: Data
): void {
    if (!checkProperties(shippingMethod, paymentMethod)) {
        throw new Error("Missing required property!");
    }

    pushEvent(event, {
        shipping_method: shippingMethod,
        payment_method: paymentMethod
    });
}
