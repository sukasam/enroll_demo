const validationRules = {
    name: {
        required: "shipping_full_name"
    },
    country: {
        required: "shipping_country"
    },
    address: {
        required: "shipping_ship_to_address"
    },
    address2: {},
    city: {
        required: "shipping_city"
    },
    state: {
        required: "shipping_state"
    },
    zip: {
        required: "shipping_zip_code"
    }
};

export default validationRules;
