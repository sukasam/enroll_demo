import { Alpha2 } from "Constants/countryConfig/enums";
import validateAddressWithQuotes from "Hydra/quotesAddressValidation";
import getShipMethods, { ShippingMethod } from "Hydra/shipMethods";

let shippingMethods: { items: ShippingMethod[] } = { items: [] };

interface CheckAddressProps {
    setInvalidAddress: () => void;
    setOutOfStockError?: (error: {
        message: string;
        // eslint-disable-next-line camelcase
        error_message: string;
    }) => void;
    values: {
        address1: string;
        address2?: string;
        city: string;
        country: Alpha2;
        zip: string;
        state?: string;
    };
    sku: string;
}

async function checkAddress(props: CheckAddressProps): Promise<boolean> {
    const { setInvalidAddress, setOutOfStockError, values, sku } = props;

    if (!shippingMethods.items.length) {
        shippingMethods = await getShipMethods({
            alpha2: values.country,
            state: values.state
        });
    }

    if (!shippingMethods.items?.length) {
        setInvalidAddress();
        return false;
    }

    const res = await validateAddressWithQuotes({
        address1: values.address1,
        address2: values.address2,
        city: values.city,
        country: values.country,
        zip: values.zip,
        state: values.state,
        shippingMethod: shippingMethods.items[0].type,
        sku
    });

    if (+(res.error?.error_code ?? 0) === 4009 && setOutOfStockError) {
        setOutOfStockError(res.error);
        return false;
    }

    // TODO: Quote validates SKU and Address here we are only setting invalid address when it could be the sku.
    // if the quote call fails to return product this is why address triggers.
    if (!res.items?.length) {
        setInvalidAddress();
        return false;
    }

    return true;
}

export default checkAddress;
