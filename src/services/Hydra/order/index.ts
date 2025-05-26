import { OrderResult } from "Contexts/types/OrderContextTypes";
import pjson from "Root/package.json";
import httpTools from "Shared/httpTools";
import getPlatform from "Utils/getPlatform";
import {
    AddTransactionsProps,
    BuildOrderItem,
    TransactionItem,
    TransactionMethod,
    TransactionType
} from "./types";

const baseURL = httpTools.getHydraAPIUrl();
const envFlag = httpTools.envFlags();

const addSkus = (
    cart: BuildOrderItem[]
): { item: { href: string }; quantity: number }[] =>
    cart.map(p => ({
        item: {
            href: `${baseURL}/${envFlag}/items?id.unicity=${p.sku}`
        },
        quantity: p.qty
    }));

const getShippingMethodHref = (shipMethod: {
    type: string;
    location?: string;
}): string =>
    `${baseURL}/${envFlag}/shippingmethods?type=${shipMethod.type}${
        shipMethod.location ? `&location=${shipMethod.location}` : ""
    }`;

const addTransactions = (props: AddTransactionsProps): TransactionItem[] => {
    const { payment, paypal, worldPaySessionId } = props;

    const items: TransactionItem[] = [];

    if (payment.method === TransactionMethod.CreditCard) {
        const isWorldPay = typeof worldPaySessionId === "string";
        const type = isWorldPay
            ? TransactionType.IOU
            : TransactionType.AuthorizeAndCapture;
        const methodDetails = isWorldPay
            ? {
                  bankName: "WorldPay",
                  challengeWindowSize: "fullPage",
                  sessionId: worldPaySessionId
              }
            : {};

        if (isWorldPay) {
            console.vlog("--- WP buildOrderRequest: type", "gray", type);
            console.vlog(
                "--- WP buildOrderRequest: methodDetails",
                "gray",
                methodDetails
            );
        }

        items.push({
            amount: "this.terms.total",
            type,
            method: payment.method,
            billToAddress: {
                city: payment.city,
                country: payment.country,
                state: payment.state,
                address1: payment.address1,
                address2: payment.address2 || "",
                zip: payment.zip
            },
            methodDetails: {
                ...methodDetails,
                creditCardNumber: payment?.creditCardNumber.replace(
                    /\s+/gi,
                    ""
                ),
                payer: `${payment.firstName} ${payment.lastName}`.trim(),
                creditCardExpires: payment?.expiry,
                creditCardSecurityCode: payment?.cvc,
                ...(payment?.bankName && { bankName: payment.bankName })
            }
        });
    } else if (payment.method === TransactionMethod.BankDraft) {
        items.push({
            amount: "this.terms.total",
            type: TransactionType.Capture,
            method: TransactionMethod.BankDraft
        });
    } else if (payment.method === TransactionMethod.BankWire) {
        items.push({
            amount: "this.terms.total",
            type: TransactionType.IOU,
            method: TransactionMethod.BankWire
        });
    } else if (payment.method === TransactionMethod.Cash) {
        items.push({
            amount: "this.terms.total",
            type: TransactionType.IOU,
            method: TransactionMethod.Cash,
            methodDetails: {
                bankName: "BANK_REFERENCED"
            }
        });
    } else if (payment.method === TransactionMethod.PayPal && paypal) {
        let item: TransactionItem = {
            amount: "this.terms.total",
            type: TransactionType.AuthorizeAndCapture,
            method: TransactionMethod.EWalletToken,
            methodDetails: {
                bankName: TransactionMethod.PayPal,
                ewalletToken: paypal.nonce,
                payer: `${paypal.firstName} ${paypal.lastName}`
            }
        };

        if (paypal?.usePayPal3ds) {
            item = {
                ...item,
                type: TransactionType.IOU,
                method: TransactionMethod.CreditCard,
                billToAddress: {
                    city: payment.city,
                    country: payment.country,
                    state: payment.state,
                    address1: payment.address1,
                    address2: payment.address2 || "",
                    zip: payment.zip
                },
                methodDetails: {
                    ...item.methodDetails,
                    bankName: TransactionMethod.PayPal3ds
                }
            };
        }
        items.push(item);
    } else if (payment.method === TransactionMethod.Klarna) {
        items.push({
            amount: "this.terms.total",
            type: TransactionType.IOU,
            method: TransactionMethod.CreditCard,
            billToEmail: payment.email,
            billToPhone: payment.phone,
            methodDetails: {
                payer: `${payment.firstName} ${payment.lastName}`.trim(),
                bankName: "WorldPay-HostedPaymentPage",
                branchName: "KLARNA_V2-SSL"
            }
        });
    }
    return items;
};

export function buildOrderRequest(
    props: any,
    token: string,
    href: string
): any {
    const {
        cartItems,
        payment,
        shipToAddress,
        shipMethod,
        shipToName,
        shipToEmail,
        shipToPhone,
        customer,
        paypal,
        sourceMarket,
        locale,
        worldPaySessionId
    } = props;

    const orderRequest = {
        customer,
        lines: {
            items: addSkus(
                cartItems.map((p: any) => ({
                    sku: p.sku,
                    qty: 1
                }))
            )
        },
        shipToAddress,
        shipToName,
        shipToEmail,
        shipToPhone,

        shippingMethod: {
            href: getShippingMethodHref(shipMethod)
        },
        transactions: {
            items: addTransactions({
                payment,
                paypal,
                worldPaySessionId
            })
        },
        source: {
            medium: "Internet",
            agent: "Enroll",
            version: pjson.version,
            platform: getPlatform(),
            market: sourceMarket
        }
    };

    return { locale, order: orderRequest, token, href };
}

export const postOrder = async ({
    locale,
    order,
    token,
    href
}: {
    locale: string;
    order: any;
    token: string;
    href: string;
}): Promise<OrderResult> => {
    const req = {
        method: "POST",
        headers: {
            "Accept-Language": locale
        },
        data: order,
        url: `/customers/${href}/orders`,
        token,
        withAuth: true,
        throwError: true,
        isErrorMessageOverride: true,
        logOptions: {
            requestName: "Make order (OTP)",
            error: true,
            functionName: "postOrder"
        }
    };

    return httpTools.sendRequest(req);
};
