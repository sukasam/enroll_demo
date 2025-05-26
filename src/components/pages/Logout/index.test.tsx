import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { useUser } from "Contexts/UserContext";
import useLoginHooks from "Contexts/hooks/LoginHooks";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import isClient from "Services/utils/isClient";
import { mockRouter, mockUseRouter } from "test-utils/router-mock";
import { TestWrapper } from "test-utils/test-wrapper";
import ResetApp from "./index";

jest.mock("Contexts/UserContext");
jest.mock("Contexts/hooks/LoginHooks");
jest.mock("Services/mixpanel/initializeMixPanel", () => ({
    trackEvent: jest.fn(),
    reset: jest.fn()
}));
jest.mock("Services/utils/isClient");

describe("ResetApp", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.document.cookie = "testCookie=value";
        global.localStorage.setItem("testKey", "testValue");
        global.sessionStorage.setItem("testKey", "testValue");
        (isClient as jest.Mock).mockReturnValue(true);
        (mixpanelService.trackEvent as jest.Mock).mockImplementation(jest.fn());
        (useUser as jest.Mock).mockReturnValue({
            resetBacktoDefault: jest.fn()
        });
        (useLoginHooks as jest.Mock).mockReturnValue({
            deleteAuthCookie: jest.fn()
        });
        mockUseRouter.mockReturnValue(mockRouter);

        // mock window.location.href
        delete (window as any).location;
        (window as any).location = {
            href: "",
            reload: jest.fn()
        };
    });

    it("renders the logout component", () => {
        render(
            <TestWrapper>
                <ResetApp />
            </TestWrapper>
        );
        expect(screen.getByTestId("logout-container")).toBeInTheDocument();
    });

    it("resets the application and redirects to /login", () => {
        mockRouter.pathname = "/someOtherPath";
        mockUseRouter.mockReturnValue(mockRouter);

        render(
            <TestWrapper>
                <ResetApp />
            </TestWrapper>
        );

        expect(useUser().resetBacktoDefault).toHaveBeenCalled();
        expect(useLoginHooks().deleteAuthCookie).toHaveBeenCalled();
        expect(global.localStorage.getItem("testKey")).toBeNull();
        expect(global.sessionStorage.getItem("testKey")).toBeNull();
        expect(mixpanelService.reset).toHaveBeenCalled();
        expect(window.location.href).toBe("/login");
    });

    it("does not reset the application when isClient is false", () => {
        (isClient as jest.Mock).mockReturnValue(false);
        render(
            <TestWrapper>
                <ResetApp />
            </TestWrapper>
        );

        expect(window.location.href).toBe("");
    });

    it("redirects to /home when pathname is /reset", () => {
        mockRouter.pathname = "/reset";
        mockUseRouter.mockReturnValue(mockRouter);

        render(
            <TestWrapper>
                <ResetApp />
            </TestWrapper>
        );

        expect(window.location.href).toBe("/home");
    });
});
