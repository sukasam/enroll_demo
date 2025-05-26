import { useEffect, useState } from "react";

export default function NoSSR({ children }) {
    const [isSSR, setIsSSR] = useState(true);
    useEffect(() => {
        setIsSSR(false);
    }, []);

    return !isSSR ? children : null;
}
