import { renderHook } from "@testing-library/react";
import * as TranslationContext from "Contexts/translation";
import { useBasicTranslate, useHasTranslation, useTranslate } from "./index";

jest.mock("Contexts/translation", () => ({
    useTranslations: jest.fn()
}));

describe("Translate component and related functions", () => {
    beforeEach(() => {
        TranslationContext.useTranslations.mockReturnValue({
            translations: {
                "Hello, {{name}}!": "Bonjour, {{name}}!"
            },
            basicTranslations: {
                Welcome: "Bienvenue"
            }
        });
    });

    test("useTranslate hook returns a translation function", () => {
        const { result } = renderHook(() => useTranslate());
        expect(typeof result.current).toBe("function");
        expect(result.current("Hello, {{name}}!", { name: "Alice" })).toBe(
            "Bonjour, Alice!"
        );
    });

    test("useBasicTranslate hook returns a translation function", () => {
        const { result } = renderHook(() => useBasicTranslate());
        expect(typeof result.current).toBe("function");
        expect(result.current("Welcome")).toBe("Bienvenue");
    });

    test("useHasTranslation hook returns a function to check translation existence", () => {
        const { result } = renderHook(() => useHasTranslation());
        expect(typeof result.current).toBe("function");
        expect(result.current("Hello, {{name}}!")).toBe(true);
        expect(result.current("Nonexistent key")).toBe(false);
    });
});
