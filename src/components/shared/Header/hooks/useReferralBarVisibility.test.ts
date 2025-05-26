import { renderHook } from "@testing-library/react";
import { useUser } from "Contexts/UserContext";
import useReferralBarVisibility from "./useReferralBarVisibility";

jest.mock("Contexts/UserContext", () => ({
    useUser: jest.fn()
}));

describe("useReferralBarVisibility", () => {
    it("should return false when enrollerId is falsy and referralBar is true", () => {
        (useUser as jest.Mock).mockReturnValue({ enrollerId: null });
        const { result } = renderHook(() => useReferralBarVisibility(true));
        expect(result.current).toBe(false);
    });

    it("should return false when enrollerId is truthy and referralBar is false", () => {
        (useUser as jest.Mock).mockReturnValue({ enrollerId: "123" });
        const { result } = renderHook(() => useReferralBarVisibility(false));
        expect(result.current).toBe(false);
    });

    it("should return true when both enrollerId and referralBar are truthy", () => {
        (useUser as jest.Mock).mockReturnValue({ enrollerId: "123" });
        const { result } = renderHook(() => useReferralBarVisibility(true));
        expect(result.current).toBe(true);
    });

    it("should return false when both enrollerId and referralBar are falsy", () => {
        (useUser as jest.Mock).mockReturnValue({ enrollerId: null });
        const { result } = renderHook(() => useReferralBarVisibility(false));
        expect(result.current).toBe(false);
    });

    it("should update when enrollerId changes", () => {
        const { result, rerender } = renderHook(() =>
            useReferralBarVisibility(true)
        );

        (useUser as jest.Mock).mockReturnValue({ enrollerId: null });
        rerender();
        expect(result.current).toBe(false);

        (useUser as jest.Mock).mockReturnValue({ enrollerId: "123" });
        rerender();
        expect(result.current).toBe(true);
    });

    it("should update when referralBar changes", () => {
        (useUser as jest.Mock).mockReturnValue({ enrollerId: "123" });
        const { result, rerender } = renderHook(
            ({ referralBar }) => useReferralBarVisibility(referralBar),
            { initialProps: { referralBar: false } }
        );

        expect(result.current).toBe(false);

        rerender({ referralBar: true });
        expect(result.current).toBe(true);
    });
});
