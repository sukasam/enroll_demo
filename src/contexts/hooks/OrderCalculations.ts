import { OrderHooksType } from "Contexts/types/OrderContextTypes";
import { Variant } from "Contexts/types/ProductContextTypes";
import { useMemo } from "react";

export default function useOrderCalculations(
    shoppingCart: Variant[]
): OrderHooksType {
    const isDigitalOnlyOrder = useMemo(
        () => shoppingCart.every(item => item.isDigital),
        [shoppingCart]
    );

    return {
        isDigitalOnlyOrder
    };
}
