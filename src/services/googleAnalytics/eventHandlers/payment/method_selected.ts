import {
    Event,
    checkProperties,
    pushEvent
} from "Services/googleAnalytics/index";

type Data = {
    paymentMethod: string;
    automatic: boolean;
};

export default function handler(
    event: Event["event"],
    { paymentMethod, automatic }: Data
): void {
    if (!checkProperties(paymentMethod, automatic)) {
        throw new Error("Missing required property!");
    }

    pushEvent(event, {
        payment_method: paymentMethod,
        automatic
    });
}
