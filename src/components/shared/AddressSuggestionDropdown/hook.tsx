import { useEffect } from "react";

function useOnClickOutside(
    ref: React.RefObject<HTMLElement>,
    handler: () => void
): void {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent): void => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler();
        };

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        return (): void => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler]);
}

export default useOnClickOutside;
