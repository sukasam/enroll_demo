import TagManager from "react-gtm-module";

import httpTools from "Shared/httpTools";

export const EVENTS = {
    // Homepage
    HOME_DROP_DOWN_COUNTRY_SELECTED: "home_drop_down_country_selected",
    HOME_BUTTON_COUNTRY_REDIRECT: "home_button_country_redirect",
    HOME_BUTTON_START_VALIDATION_ERROR: "home_button_start_validation_error",
    HOME_START_ON_SUBMIT: "home_start_on_submit",

    HOME_START_SUCCEED: "home_start_succeed",
    // Login page
    LOGIN_BUTTON_SUBMIT: "login_button_submit",
    LOGIN_SUCCEED: "login_succeed",
    LOGIN_FAILED: "login_failed",
    LOGIN_VALIDATION_ERROR: "login_validation_error",
    // Catalog page
    CATALOG_SELECT_PRODUCT: "catalog_select_product",

    // Create account
    ACCOUNT_START_FORM: "account_start_form",
    ACCOUNT_NEW_ACCOUNT_VALIDATION_ERROR:
        "account_new_account_validation_error",
    ACCOUNT_INVALID_ADDRESS_ERROR: "account_invalid_address_error",
    ACCOUNT_NEW_ACCOUNT_SUCCEED: "account_new_account_succeed",

    // Payment
    PAYMENT_BUTTON_ADDRESS_CHANGED: "payment_button_address_changed",
    PAYMENT_BUTTON_SHIPPING_METHOD_CHANGED:
        "payment_button_shipping_method_changed",
    PAYMENT_METHOD_SELECTED: "payment_method_selected",
    PAYMENT_BUTTON_SUBMIT: "payment_button_submit",
    PAYMENT_BUTTON_SUBMIT_SERVER_ERROR: "payment_button_submit_server_error",
    PAYMENT_BUTTON_SUBMIT_VALIDATION_ERROR:
        "payment_button_submit_validation_error",
    PAYMENT_SUBMIT_SUCCEED: "payment_submit_succeed",
    PAGE_CONFIGURATION: "page_configration",

    // User
    USER_DATA: "user_data"
} as const;

export type Event = {
    event: (typeof EVENTS)[keyof typeof EVENTS];
    data: {
        [property: string]: unknown;
    };
};

export function pushEvent(event: Event["event"], data?: Event["data"]): void {
    TagManager.dataLayer({
        dataLayer: {
            event,
            ...data
        }
    });
}

export function checkProperties(...properties: unknown[]): boolean {
    return properties
        .map(property => property !== undefined)
        .every(property => property);
}

export async function sendEvent(
    event: Event["event"],
    data: Event["data"] = {}
): Promise<void> {
    if (!httpTools.isProd) {
        console.log(
            `Google Analytics: Attempting to handle event "${event}" with the following data`,
            data
        );
    }

    const [catalog, ...fileParts] = event.split("_");
    const file = fileParts.join("_");

    let handler;

    try {
        const importedFile = await import(
            `./eventHandlers/${catalog}/${file}.ts`
        );

        handler = importedFile.default;
    } catch {
        if (!httpTools.isProd) {
            console.error(
                `Google Analytics: No handler for event type "${event}"`
            );
        }

        return;
    }

    try {
        handler(event, data);

        if (!httpTools.isProd) {
            console.log(
                `Google Analytics: Event "${event}" handled successfully`
            );
        }
    } catch (error) {
        if (!httpTools.isProd) {
            console.error(
                `Google Analytics: Error handling event "${event}"`,
                error
            );
        }
    }
}
