import { Alpha2 } from "Constants/countryConfig/enums";

export const shippingMethodsResponce = {
    items: [
        {
            market: "US",
            type: "Economy",
            location: "",
            shipToTime: null
        },
        {
            market: "US",
            type: "WillCall",
            location: "Nevada Office",
            shipToTime: null
        },
        {
            market: "US",
            type: "2Days",
            location: "",
            shipToTime: null
        }
    ]
};

export const quotesEconomyResponce = {
    items: [
        {
            market: "US",
            notes: null,
            shippingMethod: {
                type: "Economy",
                href: "https://hydraqa.unicity.net/v5a-test/shippingmethods?type=Economy",
                location: "",
                class: "Economy",
                warehouse: {
                    id: {
                        unicity: "121"
                    }
                }
            },
            shipToAddress: {
                country: "US",
                state: "AZ",
                city: "Phoenix",
                zip: "85016-2821",
                address1: "16 Biltmore Est",
                address2: ""
            },
            shipToEmail: null,
            shipToName: {
                firstName: "First",
                lastName: "Last"
            },
            shipToPhone: null,
            shipToTime: null,
            source: {
                agent: "Enroll-OrderCalc"
            },
            type: "Order",
            lines: {
                items: [
                    {
                        quantity: 1,
                        item: {
                            href: "https://hydraqa.unicity.net/v5a-test/items?id.unicity=33694",
                            id: {
                                unicity: "33694"
                            },
                            dimensionsEach: {
                                depth: 0,
                                height: 0,
                                unit: "in",
                                width: 0
                            },
                            taxedAs: "goods",
                            weightEach: {
                                unit: "lbs",
                                value: 0
                            }
                        },
                        quantityLimit: {
                            quantityQuota: -1,
                            timeFrameDays: -1,
                            quantityOrdered: 0
                        },
                        terms: {
                            cvEach: 1000,
                            priceEach: 1499,
                            pvEach: 1000,
                            subtotal: null,
                            tax: {
                                categoryDescription: "*****",
                                aggregate: {
                                    items: [
                                        {
                                            jurisdiction: {
                                                state: "ARIZONA"
                                            },
                                            type: "State",
                                            amount: 0,
                                            percentage: 0
                                        },
                                        {
                                            jurisdiction: {
                                                county: "MARICOPA"
                                            },
                                            type: "County",
                                            amount: 0,
                                            percentage: 0
                                        },
                                        {
                                            jurisdiction: {
                                                city: "PHOENIX"
                                            },
                                            type: "City",
                                            amount: 0,
                                            percentage: 0
                                        }
                                    ],
                                    amount: 0
                                }
                            },
                            taxablePriceEach: 1499,
                            pv: 1000,
                            price: 1499
                        },
                        catalogSlide: {
                            content: {
                                description: "Pack Feel Great Lemon 10"
                            }
                        },
                        kitChildren: [
                            {
                                item: {
                                    dimensionsEach: {
                                        depth: 2.75,
                                        height: 9,
                                        unit: "in",
                                        width: 2.75
                                    },
                                    id: {
                                        unicity: "32015"
                                    },
                                    taxedAs: "goods",
                                    weightEach: {
                                        unit: "lbs",
                                        value: 0.2
                                    }
                                },
                                quantity: 10,
                                catalogSlide: {
                                    content: {
                                        description: "Diamond Bottle 500ml"
                                    }
                                },
                                terms: {
                                    cvEach: 0,
                                    priceEach: 0,
                                    pvEach: 0,
                                    subtotal: null,
                                    tax: {
                                        categoryDescription: "TG102",
                                        aggregate: {
                                            items: [
                                                {
                                                    jurisdiction: {
                                                        state: "ARIZONA"
                                                    },
                                                    type: "State",
                                                    amount: 0,
                                                    percentage: 0
                                                },
                                                {
                                                    jurisdiction: {
                                                        county: "MARICOPA"
                                                    },
                                                    type: "County",
                                                    amount: 0,
                                                    percentage: 0
                                                },
                                                {
                                                    jurisdiction: {
                                                        city: "PHOENIX"
                                                    },
                                                    type: "City",
                                                    amount: 0,
                                                    percentage: 0
                                                }
                                            ],
                                            amount: 0
                                        }
                                    },
                                    taxablePriceEach: 0
                                }
                            },
                            {
                                item: {
                                    dimensionsEach: {
                                        depth: 4.75,
                                        height: 7,
                                        unit: "in",
                                        width: 7
                                    },
                                    id: {
                                        unicity: "35287"
                                    },
                                    taxedAs: "goods",
                                    weightEach: {
                                        unit: "lbs",
                                        value: 1.3
                                    }
                                },
                                quantity: 10,
                                catalogSlide: {
                                    content: {
                                        description:
                                            "Balance Cholesterol Natural Orange STPK"
                                    }
                                },
                                terms: {
                                    cvEach: 50,
                                    priceEach: 76.4,
                                    pvEach: 50,
                                    subtotal: null,
                                    tax: {
                                        categoryDescription: "TG75",
                                        aggregate: {
                                            items: [
                                                {
                                                    jurisdiction: {
                                                        state: "ARIZONA"
                                                    },
                                                    type: "State",
                                                    amount: 42.78,
                                                    percentage: 5.6
                                                },
                                                {
                                                    jurisdiction: {
                                                        county: "MARICOPA"
                                                    },
                                                    type: "County",
                                                    amount: 5.35,
                                                    percentage: 0.7
                                                },
                                                {
                                                    jurisdiction: {
                                                        city: "PHOENIX"
                                                    },
                                                    type: "City",
                                                    amount: 17.57,
                                                    percentage: 2.3
                                                }
                                            ],
                                            amount: 65.7
                                        }
                                    },
                                    taxablePriceEach: 76.4
                                }
                            },
                            {
                                item: {
                                    dimensionsEach: {
                                        depth: 5.75,
                                        height: 10.25,
                                        unit: "in",
                                        width: 10
                                    },
                                    id: {
                                        unicity: "35401"
                                    },
                                    taxedAs: "goods",
                                    weightEach: {
                                        unit: "lbs",
                                        value: 2.5
                                    }
                                },
                                quantity: 10,
                                catalogSlide: {
                                    content: {
                                        description:
                                            "Box Shipper FG SP Eng 10 x 10 3/16 x 5 3/4"
                                    }
                                },
                                terms: {
                                    cvEach: 0,
                                    priceEach: 0,
                                    pvEach: 0,
                                    subtotal: null,
                                    tax: {
                                        categoryDescription: "*****",
                                        aggregate: {
                                            items: [
                                                {
                                                    jurisdiction: {
                                                        state: "ARIZONA"
                                                    },
                                                    type: "State",
                                                    amount: 0,
                                                    percentage: 0
                                                },
                                                {
                                                    jurisdiction: {
                                                        county: "MARICOPA"
                                                    },
                                                    type: "County",
                                                    amount: 0,
                                                    percentage: 0
                                                },
                                                {
                                                    jurisdiction: {
                                                        city: "PHOENIX"
                                                    },
                                                    type: "City",
                                                    amount: 0,
                                                    percentage: 0
                                                }
                                            ],
                                            amount: 0
                                        }
                                    },
                                    taxablePriceEach: 0
                                }
                            },
                            {
                                item: {
                                    dimensionsEach: {
                                        depth: 4.25,
                                        height: 6.1,
                                        unit: "in",
                                        width: 3.25
                                    },
                                    id: {
                                        unicity: "35755"
                                    },
                                    taxedAs: "goods",
                                    weightEach: {
                                        unit: "lbs",
                                        value: 0.5
                                    }
                                },
                                quantity: 10,
                                catalogSlide: {
                                    content: {
                                        description:
                                            "Unimate Natural Lemon STPK"
                                    }
                                },
                                terms: {
                                    cvEach: 50,
                                    priceEach: 73.5,
                                    pvEach: 50,
                                    subtotal: null,
                                    tax: {
                                        categoryDescription: "TG75",
                                        aggregate: {
                                            items: [
                                                {
                                                    jurisdiction: {
                                                        state: "ARIZONA"
                                                    },
                                                    type: "State",
                                                    amount: 41.16,
                                                    percentage: 5.6
                                                },
                                                {
                                                    jurisdiction: {
                                                        county: "MARICOPA"
                                                    },
                                                    type: "County",
                                                    amount: 5.14,
                                                    percentage: 0.7
                                                },
                                                {
                                                    jurisdiction: {
                                                        city: "PHOENIX"
                                                    },
                                                    type: "City",
                                                    amount: 16.91,
                                                    percentage: 2.3
                                                }
                                            ],
                                            amount: 63.21
                                        }
                                    },
                                    taxablePriceEach: 73.5
                                }
                            }
                        ]
                    },
                    {
                        quantity: 1,
                        item: {
                            href: "https://hydraqa.unicity.net/v5a-test/items?id.unicity=31440",
                            id: {
                                unicity: "31440"
                            },
                            dimensionsEach: {
                                depth: 0,
                                height: 0,
                                unit: "in",
                                width: 0
                            },
                            taxedAs: "service",
                            weightEach: {
                                unit: "lbs",
                                value: 0
                            }
                        },
                        quantityLimit: {
                            quantityQuota: -1,
                            timeFrameDays: -1,
                            quantityOrdered: 0
                        },
                        terms: {
                            cvEach: 0,
                            priceEach: 40,
                            pvEach: 0,
                            subtotal: null,
                            tax: {
                                categoryDescription: "*****",
                                aggregate: {
                                    items: [
                                        {
                                            jurisdiction: {
                                                state: "ARIZONA"
                                            },
                                            type: "State",
                                            amount: 0,
                                            percentage: 0
                                        },
                                        {
                                            jurisdiction: {
                                                county: "MARICOPA"
                                            },
                                            type: "County",
                                            amount: 0,
                                            percentage: 0
                                        },
                                        {
                                            jurisdiction: {
                                                city: "PHOENIX"
                                            },
                                            type: "City",
                                            amount: 0,
                                            percentage: 0
                                        }
                                    ],
                                    amount: 0
                                }
                            },
                            taxablePriceEach: 0,
                            pv: 0,
                            price: 40
                        },
                        catalogSlide: {
                            content: {
                                description: "Unicity Digital Getting"
                            }
                        },
                        kitChildren: []
                    }
                ],
                aggregate: {
                    weight: {
                        unit: "lbs",
                        value: 45
                    }
                }
            },
            transactions: {
                items: []
            },
            terms: {
                subtotal: 1539,
                discount: {
                    amount: 40
                },
                freight: {
                    amount: 0,
                    terms: {
                        tax: {
                            aggregate: {
                                items: [
                                    {
                                        jurisdiction: {
                                            state: "ARIZONA"
                                        },
                                        type: "State",
                                        amount: 0,
                                        percentage: 0
                                    },
                                    {
                                        jurisdiction: {
                                            county: "MARICOPA"
                                        },
                                        type: "County",
                                        amount: 0,
                                        percentage: 0
                                    },
                                    {
                                        jurisdiction: {
                                            city: "PHOENIX"
                                        },
                                        type: "City",
                                        amount: 0,
                                        percentage: 0
                                    }
                                ],
                                amount: 0
                            }
                        }
                    },
                    taxablePrice: 0
                },
                pretotal: 1627.91,
                pv: 1000,
                tax: {
                    amount: 128.91
                },
                taxableTotal: 1499,
                timbre: {
                    amount: 0
                },
                total: 1627.91,
                weight: 45
            },
            dateCreated: "2024-04-08T16:40:41-06:00",
            currency: "USD",
            giftReceipt: false,
            customer: {
                id: {
                    unicity: "3"
                },
                status: "Active",
                type: "Member"
            },
            recurrence: null,
            added_lines: {
                items: [],
                aggregate: {
                    weight: {
                        unit: "lbs",
                        value: 0
                    }
                }
            },
            seller: {
                href: "https://hydraqa.unicity.net/v5a-test/sellers/e7c10d4e70b0c857a99c16576ade8003",
                id: {
                    unicity: "5"
                }
            },
            added_transactions: {
                items: []
            }
        }
    ]
};

export const quotes2DaysResponce = {
    items: [
        {
            market: "US",
            notes: null,
            shippingMethod: {
                type: "2Days",
                href: "https://hydraqa.unicity.net/v5a-test/shippingmethods?type=2Days",
                location: "",
                class: "2Days",
                warehouse: {
                    id: {
                        unicity: "121"
                    }
                }
            },
            shipToAddress: {
                country: "US",
                state: "AZ",
                city: "Phoenix",
                zip: "85016-2821",
                address1: "16 Biltmore Est",
                address2: ""
            },
            shipToEmail: null,
            shipToName: {
                firstName: "First",
                lastName: "Last"
            },
            shipToPhone: null,
            shipToTime: null,
            source: {
                agent: "Enroll-OrderCalc"
            },
            type: "Order",
            lines: {
                items: [
                    {
                        quantity: 1,
                        item: {
                            href: "https://hydraqa.unicity.net/v5a-test/items?id.unicity=33694",
                            id: {
                                unicity: "33694"
                            },
                            dimensionsEach: {
                                depth: 0,
                                height: 0,
                                unit: "in",
                                width: 0
                            },
                            taxedAs: "goods",
                            weightEach: {
                                unit: "lbs",
                                value: 0
                            }
                        },
                        quantityLimit: {
                            quantityQuota: -1,
                            timeFrameDays: -1,
                            quantityOrdered: 0
                        },
                        terms: {
                            cvEach: 1000,
                            priceEach: 1499,
                            pvEach: 1000,
                            subtotal: null,
                            tax: {
                                categoryDescription: "*****",
                                aggregate: {
                                    items: [
                                        {
                                            jurisdiction: {
                                                state: "ARIZONA"
                                            },
                                            type: "State",
                                            amount: 0,
                                            percentage: 0
                                        },
                                        {
                                            jurisdiction: {
                                                county: "MARICOPA"
                                            },
                                            type: "County",
                                            amount: 0,
                                            percentage: 0
                                        },
                                        {
                                            jurisdiction: {
                                                city: "PHOENIX"
                                            },
                                            type: "City",
                                            amount: 0,
                                            percentage: 0
                                        }
                                    ],
                                    amount: 0
                                }
                            },
                            taxablePriceEach: 1499,
                            pv: 1000,
                            price: 1499
                        },
                        catalogSlide: {
                            content: {
                                description: "Pack Feel Great Lemon 10"
                            }
                        },
                        kitChildren: [
                            {
                                item: {
                                    dimensionsEach: {
                                        depth: 2.75,
                                        height: 9,
                                        unit: "in",
                                        width: 2.75
                                    },
                                    id: {
                                        unicity: "32015"
                                    },
                                    taxedAs: "goods",
                                    weightEach: {
                                        unit: "lbs",
                                        value: 0.2
                                    }
                                },
                                quantity: 10,
                                catalogSlide: {
                                    content: {
                                        description: "Diamond Bottle 500ml"
                                    }
                                },
                                terms: {
                                    cvEach: 0,
                                    priceEach: 0,
                                    pvEach: 0,
                                    subtotal: null,
                                    tax: {
                                        categoryDescription: "TG102",
                                        aggregate: {
                                            items: [
                                                {
                                                    jurisdiction: {
                                                        state: "ARIZONA"
                                                    },
                                                    type: "State",
                                                    amount: 0,
                                                    percentage: 0
                                                },
                                                {
                                                    jurisdiction: {
                                                        county: "MARICOPA"
                                                    },
                                                    type: "County",
                                                    amount: 0,
                                                    percentage: 0
                                                },
                                                {
                                                    jurisdiction: {
                                                        city: "PHOENIX"
                                                    },
                                                    type: "City",
                                                    amount: 0,
                                                    percentage: 0
                                                }
                                            ],
                                            amount: 0
                                        }
                                    },
                                    taxablePriceEach: 0
                                }
                            },
                            {
                                item: {
                                    dimensionsEach: {
                                        depth: 4.75,
                                        height: 7,
                                        unit: "in",
                                        width: 7
                                    },
                                    id: {
                                        unicity: "35287"
                                    },
                                    taxedAs: "goods",
                                    weightEach: {
                                        unit: "lbs",
                                        value: 1.3
                                    }
                                },
                                quantity: 10,
                                catalogSlide: {
                                    content: {
                                        description:
                                            "Balance Cholesterol Natural Orange STPK"
                                    }
                                },
                                terms: {
                                    cvEach: 50,
                                    priceEach: 76.4,
                                    pvEach: 50,
                                    subtotal: null,
                                    tax: {
                                        categoryDescription: "TG75",
                                        aggregate: {
                                            items: [
                                                {
                                                    jurisdiction: {
                                                        state: "ARIZONA"
                                                    },
                                                    type: "State",
                                                    amount: 42.78,
                                                    percentage: 5.6
                                                },
                                                {
                                                    jurisdiction: {
                                                        county: "MARICOPA"
                                                    },
                                                    type: "County",
                                                    amount: 5.35,
                                                    percentage: 0.7
                                                },
                                                {
                                                    jurisdiction: {
                                                        city: "PHOENIX"
                                                    },
                                                    type: "City",
                                                    amount: 17.57,
                                                    percentage: 2.3
                                                }
                                            ],
                                            amount: 65.7
                                        }
                                    },
                                    taxablePriceEach: 76.4
                                }
                            },
                            {
                                item: {
                                    dimensionsEach: {
                                        depth: 5.75,
                                        height: 10.25,
                                        unit: "in",
                                        width: 10
                                    },
                                    id: {
                                        unicity: "35401"
                                    },
                                    taxedAs: "goods",
                                    weightEach: {
                                        unit: "lbs",
                                        value: 2.5
                                    }
                                },
                                quantity: 10,
                                catalogSlide: {
                                    content: {
                                        description:
                                            "Box Shipper FG SP Eng 10 x 10 3/16 x 5 3/4"
                                    }
                                },
                                terms: {
                                    cvEach: 0,
                                    priceEach: 0,
                                    pvEach: 0,
                                    subtotal: null,
                                    tax: {
                                        categoryDescription: "*****",
                                        aggregate: {
                                            items: [
                                                {
                                                    jurisdiction: {
                                                        state: "ARIZONA"
                                                    },
                                                    type: "State",
                                                    amount: 0,
                                                    percentage: 0
                                                },
                                                {
                                                    jurisdiction: {
                                                        county: "MARICOPA"
                                                    },
                                                    type: "County",
                                                    amount: 0,
                                                    percentage: 0
                                                },
                                                {
                                                    jurisdiction: {
                                                        city: "PHOENIX"
                                                    },
                                                    type: "City",
                                                    amount: 0,
                                                    percentage: 0
                                                }
                                            ],
                                            amount: 0
                                        }
                                    },
                                    taxablePriceEach: 0
                                }
                            },
                            {
                                item: {
                                    dimensionsEach: {
                                        depth: 4.25,
                                        height: 6.1,
                                        unit: "in",
                                        width: 3.25
                                    },
                                    id: {
                                        unicity: "35755"
                                    },
                                    taxedAs: "goods",
                                    weightEach: {
                                        unit: "lbs",
                                        value: 0.5
                                    }
                                },
                                quantity: 10,
                                catalogSlide: {
                                    content: {
                                        description:
                                            "Unimate Natural Lemon STPK"
                                    }
                                },
                                terms: {
                                    cvEach: 50,
                                    priceEach: 73.5,
                                    pvEach: 50,
                                    subtotal: null,
                                    tax: {
                                        categoryDescription: "TG75",
                                        aggregate: {
                                            items: [
                                                {
                                                    jurisdiction: {
                                                        state: "ARIZONA"
                                                    },
                                                    type: "State",
                                                    amount: 41.16,
                                                    percentage: 5.6
                                                },
                                                {
                                                    jurisdiction: {
                                                        county: "MARICOPA"
                                                    },
                                                    type: "County",
                                                    amount: 5.14,
                                                    percentage: 0.7
                                                },
                                                {
                                                    jurisdiction: {
                                                        city: "PHOENIX"
                                                    },
                                                    type: "City",
                                                    amount: 16.91,
                                                    percentage: 2.3
                                                }
                                            ],
                                            amount: 63.21
                                        }
                                    },
                                    taxablePriceEach: 73.5
                                }
                            }
                        ]
                    },
                    {
                        quantity: 1,
                        item: {
                            href: "https://hydraqa.unicity.net/v5a-test/items?id.unicity=31440",
                            id: {
                                unicity: "31440"
                            },
                            dimensionsEach: {
                                depth: 0,
                                height: 0,
                                unit: "in",
                                width: 0
                            },
                            taxedAs: "service",
                            weightEach: {
                                unit: "lbs",
                                value: 0
                            }
                        },
                        quantityLimit: {
                            quantityQuota: -1,
                            timeFrameDays: -1,
                            quantityOrdered: 0
                        },
                        terms: {
                            cvEach: 0,
                            priceEach: 40,
                            pvEach: 0,
                            subtotal: null,
                            tax: {
                                categoryDescription: "*****",
                                aggregate: {
                                    items: [
                                        {
                                            jurisdiction: {
                                                state: "ARIZONA"
                                            },
                                            type: "State",
                                            amount: 0,
                                            percentage: 0
                                        },
                                        {
                                            jurisdiction: {
                                                county: "MARICOPA"
                                            },
                                            type: "County",
                                            amount: 0,
                                            percentage: 0
                                        },
                                        {
                                            jurisdiction: {
                                                city: "PHOENIX"
                                            },
                                            type: "City",
                                            amount: 0,
                                            percentage: 0
                                        }
                                    ],
                                    amount: 0
                                }
                            },
                            taxablePriceEach: 0,
                            pv: 0,
                            price: 40
                        },
                        catalogSlide: {
                            content: {
                                description: "Unicity Digital Getting"
                            }
                        },
                        kitChildren: []
                    }
                ],
                aggregate: {
                    weight: {
                        unit: "lbs",
                        value: 45
                    }
                }
            },
            transactions: {
                items: []
            },
            terms: {
                subtotal: 1539,
                discount: {
                    amount: 40
                },
                freight: {
                    amount: 127.42,
                    terms: {
                        tax: {
                            aggregate: {
                                items: [
                                    {
                                        jurisdiction: {
                                            state: "ARIZONA"
                                        },
                                        type: "State",
                                        amount: 7.14,
                                        percentage: 5.6
                                    },
                                    {
                                        jurisdiction: {
                                            county: "MARICOPA"
                                        },
                                        type: "County",
                                        amount: 0.89,
                                        percentage: 0.7
                                    },
                                    {
                                        jurisdiction: {
                                            city: "PHOENIX"
                                        },
                                        type: "City",
                                        amount: 2.93,
                                        percentage: 2.3
                                    }
                                ],
                                amount: 10.96
                            }
                        }
                    },
                    taxablePrice: 127.42
                },
                pretotal: 1766.29,
                pv: 1000,
                tax: {
                    amount: 139.87
                },
                taxableTotal: 1626.42,
                timbre: {
                    amount: 0
                },
                total: 1766.29,
                weight: 45
            },
            dateCreated: "2024-04-08T17:30:07-06:00",
            currency: "USD",
            giftReceipt: false,
            customer: {
                id: {
                    unicity: "3"
                },
                status: "Active",
                type: "Member"
            },
            recurrence: null,
            added_lines: {
                items: [],
                aggregate: {
                    weight: {
                        unit: "lbs",
                        value: 0
                    }
                }
            },
            seller: {
                href: "https://hydraqa.unicity.net/v5a-test/sellers/e7c10d4e70b0c857a99c16576ade8003",
                id: {
                    unicity: "5"
                }
            },
            added_transactions: {
                items: []
            }
        }
    ]
};

export const quotesWillCallResponce = {
    error: {
        code: 400,
        message: "Bad Request",
        error_code: "4009",
        error_message:
            "The following items are out of stock: (33694) Error #J7P9Y"
    }
};

export const shipToAddressUsMock = {
    name: "First Last",
    country: Alpha2.US,
    state: "AZ",
    city: "Phoenix",
    zip: "85016-2821",
    address1: "16 Biltmore Est",
    address2: ""
};

export const shipToAddressCaMock = {
    country: Alpha2.CA,
    state: "",
    city: "Bayfield",
    zip: "NB E4M 6N4",
    address1: "592 Railroad St.",
    address2: ""
};

export const mappedShippingMethodsMock = {
    market: Alpha2.US,
    type: "Economy",
    location: "Mocked Location",
    productPrice: "11",
    shipping: "22",
    subtotal: "33",
    tax: "44",
    orderTotal: "55"
};
