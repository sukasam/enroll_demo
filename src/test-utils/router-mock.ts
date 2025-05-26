import { NextRouter } from "next/router";

// Create mock router events
const mockRouterEvents = {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn()
};

// Create mock router object
export const mockRouter: NextRouter = {
    route: "/",
    pathname: "/",
    query: {},
    asPath: "/",
    basePath: "",
    locale: "en",
    locales: ["en"],
    defaultLocale: "en",
    isLocaleDomain: false,
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: mockRouterEvents,
    isFallback: false,
    isReady: true,
    isPreview: false
};

// Create mock useRouter hook
export const mockUseRouter = jest.fn().mockReturnValue(mockRouter);

// Mock the useRouter hook
jest.mock("next/router", () => ({
    useRouter: (): NextRouter => mockRouter
}));

// Initialize router mock before tests
beforeAll(() => {
    // Required for Next.js router
    (global as { __NEXT_DATA__?: any }).__NEXT_DATA__ = {
        props: {},
        page: "",
        query: {},
        buildId: ""
    };
});

// Helper function to create a custom mock router
export function createMockRouter(
    overrides: Partial<NextRouter> = {}
): NextRouter {
    return {
        ...mockRouter,
        ...overrides
    };
}
