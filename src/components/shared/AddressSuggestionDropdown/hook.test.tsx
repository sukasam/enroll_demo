import { fireEvent, render, renderHook } from "@testing-library/react";
// eslint-disable-next-line no-use-before-define
import React from "react";
import useOnClickOutside from "./hook";

describe("useOnClickOutside", () => {
    it("should call handler when clicking outside the ref element", () => {
        const handler = jest.fn();
        const { result } = renderHook(() => {
            const ref = React.useRef(null);
            useOnClickOutside(ref, handler);
            return ref;
        });

        const { container } = render(
            <div>
                <div ref={result.current} data-testid="inside">
                    Inside
                </div>
                <div data-testid="outside">Outside</div>
            </div>
        );

        fireEvent.mouseDown(
            container.querySelector('[data-testid="outside"]')!
        );
        expect(handler).toHaveBeenCalledTimes(1);

        fireEvent.mouseDown(container.querySelector('[data-testid="inside"]')!);
        expect(handler).toHaveBeenCalledTimes(1);
    });

    it("should call handler when touching outside the ref element", () => {
        const handler = jest.fn();
        const { result } = renderHook(() => {
            const ref = React.useRef(null);
            useOnClickOutside(ref, handler);
            return ref;
        });

        const { container } = render(
            <div>
                <div ref={result.current} data-testid="inside">
                    Inside
                </div>
                <div data-testid="outside">Outside</div>
            </div>
        );

        fireEvent.touchStart(
            container.querySelector('[data-testid="outside"]')!
        );
        expect(handler).toHaveBeenCalledTimes(1);

        fireEvent.touchStart(
            container.querySelector('[data-testid="inside"]')!
        );
        expect(handler).toHaveBeenCalledTimes(1);
    });

    it("should not call handler when ref is null", () => {
        const handler = jest.fn();
        renderHook(() => useOnClickOutside({ current: null }, handler));

        fireEvent.mouseDown(document.body);
        expect(handler).not.toHaveBeenCalled();
    });

    it("should remove event listeners on unmount", () => {
        const handler = jest.fn();
        const { unmount } = renderHook(() => {
            const ref = React.useRef(document.createElement("div"));
            useOnClickOutside(ref, handler);
        });

        const removeEventListenerSpy = jest.spyOn(
            document,
            "removeEventListener"
        );
        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            "mousedown",
            expect.any(Function)
        );
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            "touchstart",
            expect.any(Function)
        );

        removeEventListenerSpy.mockRestore();
    });
});
