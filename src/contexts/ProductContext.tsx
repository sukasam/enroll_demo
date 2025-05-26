import {
    ReactElement,
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import noPurchaseVariantData from "./data/NoPurchaseProductData";
import useProductCalculations from "./hooks/ProductCalculations";
import {
    Product,
    ProductContextType,
    Variant
} from "./types/ProductContextTypes";

const defaultProductContext: ProductContextType = {
    selectedSku: null,
    setSelectedSku: () => null,
    shoppingCart: [],
    setShoppingCart: () => null,
    products: [],
    setProducts: () => null,
    mappedProducts: [],
    setMappedProducts: () => null,
    href: null,
    setHref: () => null,
    availableDigitalGuideVariant: null,
    digitalVariants: [],
    ufgVariants: [],
    recommendedPack: null,
    digitalPack: null,
    feelGreatPack: null,
    noPurchaseVariantData: []
};

export const ProductContext = createContext<ProductContextType>(
    defaultProductContext
);

ProductContext.displayName = "Product Context";

export function ProductProvider({
    children,
    testValues
}: {
    children: ReactNode;
    testValues?: Record<string, string>;
}): ReactElement {
    const [selectedSku, setSelectedSku] = useState<string | null>(
        defaultProductContext.selectedSku
    );
    const [shoppingCart, setShoppingCartState] = useState<Variant[]>(
        defaultProductContext.shoppingCart
    );
    const [products, setProducts] = useState<Product[]>(
        defaultProductContext.products
    );
    const [mappedProducts, setMappedProducts] = useState<Variant[]>(
        defaultProductContext.mappedProducts
    );
    const [href, setHref] = useState<string | null>(defaultProductContext.href);

    const {
        availableDigitalGuideVariant,
        ufgVariants,
        digitalVariants,
        digitalPack,
        feelGreatPack,
        recommendedPack
    } = useProductCalculations(shoppingCart, products);

    const setShoppingCart = useCallback(
        (newCart: Variant[] | null): void => {
            if (newCart && newCart.length === 0) {
                setShoppingCartState([]);
                return;
            }

            let cart = newCart || shoppingCart;
            const hasDigitalGuide = cart?.find(variant => variant.isDigital);

            if (availableDigitalGuideVariant && hasDigitalGuide) {
                cart = cart?.filter(variant => !variant.isDigital);
                cart.push(availableDigitalGuideVariant);
                setShoppingCartState(cart);
                return;
            }

            if (
                cart &&
                cart.length > 0 &&
                !hasDigitalGuide &&
                availableDigitalGuideVariant
            ) {
                cart.push(availableDigitalGuideVariant);
            }
            setShoppingCartState(cart);
        },
        [shoppingCart, availableDigitalGuideVariant, setShoppingCartState]
    );

    useEffect((): void => {
        setShoppingCart(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availableDigitalGuideVariant]);

    const loadCachedProductData = (): void => {
        const cachedData = sessionStorage.getItem("productContext");
        if (cachedData) {
            const parsedData: Pick<
                ProductContextType,
                "selectedSku" | "products" | "shoppingCart" | "mappedProducts"
            > = JSON.parse(cachedData);
            setSelectedSku(parsedData.selectedSku);
            setShoppingCart(parsedData.shoppingCart);
            setProducts(parsedData.products);
            setMappedProducts(parsedData.mappedProducts);
        }
    };

    useEffect(() => {
        loadCachedProductData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateCachedProductData = useCallback((): void => {
        const dataToCache = {
            selectedSku,
            products,
            shoppingCart,
            mappedProducts
        };
        sessionStorage.setItem("productContext", JSON.stringify(dataToCache));
    }, [selectedSku, products, shoppingCart, mappedProducts]);

    useEffect(() => {
        updateCachedProductData();
    }, [updateCachedProductData]);

    const value = useMemo(
        () => ({
            selectedSku,
            setSelectedSku,
            shoppingCart,
            setShoppingCart,
            products,
            setProducts,
            mappedProducts,
            setMappedProducts,
            href,
            setHref,
            availableDigitalGuideVariant,
            digitalVariants,
            ufgVariants,
            digitalPack,
            feelGreatPack,
            recommendedPack,
            noPurchaseVariantData
        }),
        [
            selectedSku,
            products,
            shoppingCart,
            setShoppingCart,
            mappedProducts,
            href,
            availableDigitalGuideVariant,
            digitalVariants,
            ufgVariants,
            digitalPack,
            feelGreatPack,
            recommendedPack,
            noPurchaseVariantData
        ]
    );

    const providerValue = useMemo(
        () => ({
            ...value,
            ...testValues
        }),
        [value, testValues]
    );

    return (
        <ProductContext.Provider value={providerValue}>
            {children}
        </ProductContext.Provider>
    );
}

export const useProducts = (): ProductContextType => useContext(ProductContext);
