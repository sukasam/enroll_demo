import {
    Event,
    checkProperties,
    pushEvent
} from "Services/googleAnalytics/index";

type Data = {
    responseCode: number;
    errorMessage: string;
};

export default function handler(
    event: Event["event"],
    { responseCode, errorMessage }: Data
): void {
    if (!checkProperties(responseCode, errorMessage)) {
        throw new Error("Missing required property!");
    }

    pushEvent(event, {
        response_code: responseCode,
        error_message: errorMessage
    });
}
