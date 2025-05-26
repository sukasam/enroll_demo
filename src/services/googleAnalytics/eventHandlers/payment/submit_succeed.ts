import {
    Event,
    checkProperties,
    pushEvent
} from "Services/googleAnalytics/index";

type Data = {
    sku: string;
    shippingMethod: string;
    paymentMethod: string;
    price: number;
    userId: string;
};

export default function handler(
    event: Event["event"],
    { sku, shippingMethod, paymentMethod, price, userId }: Data
): void {
    if (!checkProperties(sku, shippingMethod, paymentMethod, price)) {
        throw new Error("Missing required property!");
    }

    pushEvent(event, {
        sku,
        shipping_method: shippingMethod,
        payment_method: paymentMethod,
        price,
        user_id: userId
    });
}
