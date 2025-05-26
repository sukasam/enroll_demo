import { render } from "@testing-library/react";
import { NextRouter } from "next/router";
import React, { useMemo } from "react";

interface TestWrapperProps {
    children: React.ReactNode;
    router?: Partial<NextRouter>;
}

const defaultRouter: NextRouter = {
    basePath: "",
    pathname: "/",
    route: "/",
    asPath: "/",
    query: {},
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn()
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    isPreview: false,
    locale: "en",
    locales: ["en"],
    defaultLocale: "en"
};

export function TestWrapper({
    children,
    router = {}
}: TestWrapperProps): JSX.Element {
    const routerInstance = useMemo(
        () => ({
            ...defaultRouter,
            ...router
        }),
        [router]
    );

    // Set up the router context
    (global as any).__NEXT_DATA__ = {
        props: {},
        page: "",
        query: {},
        buildId: "test-build-id"
    };

    // Mock the router context
    (global as any).__NEXT_ROUTER = routerInstance;

    return <div data-testid="test-wrapper">{children}</div>;
}

export function renderWithWrapper(
    ui: React.ReactElement,
    options = {}
): ReturnType<typeof render> {
    return render(ui, { wrapper: TestWrapper, ...options });
}
