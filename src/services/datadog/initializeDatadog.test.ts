import pkgJson from "Root/package.json";

// Mock setup
jest.mock("../../pages/_app.hooks", () => ({
    getGA4SessionId: jest.fn(() => "mocked-ga4-session-id")
}));

jest.mock("Services/mixpanel/initializeMixPanel", () => ({
    __esModule: true,
    default: {
        registerSuperProperties: jest.fn()
    }
}));

// Mock datadog using factory function
jest.mock("@datadog/browser-rum", () => {
    const mockInit = jest.fn();
    const mockStartSessionReplayRecording = jest.fn();
    const mockOnReady = jest.fn();
    const mockGetInternalContext = jest.fn();
    return {
        datadogRum: {
            init: mockInit,
            startSessionReplayRecording: mockStartSessionReplayRecording,
            onReady: mockOnReady,
            getInternalContext: mockGetInternalContext
        }
    };
});

interface DatadogRumMocks {
    init: jest.Mock;
    startSessionReplayRecording: jest.Mock;
    onReady: jest.Mock;
    getInternalContext: jest.Mock;
}

function getDatadogRumMocks(): DatadogRumMocks {
    // Always get fresh mocks after jest.resetModules
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    return require("@datadog/browser-rum").datadogRum;
}

describe("initializeDatadog", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it("should not initialize Datadog when environment is not production or development", () => {
        process.env.NEXT_PUBLIC_DATADOG_ENV = "test";
        const { init, startSessionReplayRecording } = getDatadogRumMocks();
        // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
        const initializeDatadog = require("./initializeDatadog").default;
        initializeDatadog();
        expect(init).not.toHaveBeenCalled();
        expect(startSessionReplayRecording).not.toHaveBeenCalled();
    });

    it("should initialize Datadog when environment is development", () => {
        process.env.NEXT_PUBLIC_DATADOG_ENV = "development";
        process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID = "test-app-id";
        process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN = "test-client-token";
        const {
            init,
            startSessionReplayRecording,
            onReady,
            getInternalContext
        } = getDatadogRumMocks();
        getInternalContext.mockReturnValue({ session_id: "mocked-session-id" });
        onReady.mockImplementation((callback: () => void) =>
            (callback as () => void)()
        );
        // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
        const initializeDatadog = require("./initializeDatadog").default;
        initializeDatadog();
        expect(init).toHaveBeenCalledWith(
            expect.objectContaining({
                applicationId: "test-app-id",
                clientToken: "test-client-token",
                site: "us5.datadoghq.com",
                service: "enrollment2.0",
                env: "development",
                version: pkgJson.version,
                sessionSampleRate: 100,
                premiumSampleRate: 100,
                trackResources: true,
                trackLongTasks: true,
                trackUserInteractions: true,
                defaultPrivacyLevel: "mask-user-input",
                trackFrustrations: true,
                beforeSend: expect.any(Function)
            })
        );
        expect(startSessionReplayRecording).toHaveBeenCalled();
        expect(onReady).toHaveBeenCalled();
    });

    it("should use empty strings for applicationId and clientToken if not provided", () => {
        process.env.NEXT_PUBLIC_DATADOG_ENV = "development";
        delete process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID;
        delete process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN;
        const { init } = getDatadogRumMocks();
        // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
        const initializeDatadog = require("./initializeDatadog").default;
        initializeDatadog();
        expect(init).toHaveBeenCalledWith(
            expect.objectContaining({
                applicationId: "",
                clientToken: ""
            })
        );
    });

    it("should add GA4 session ID to event context in beforeSend function", () => {
        process.env.NEXT_PUBLIC_DATADOG_ENV = "development";
        process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID = "test-app-id";
        process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN = "test-client-token";
        const { init, getInternalContext, onReady } = getDatadogRumMocks();
        getInternalContext.mockReturnValue({ session_id: "mocked-session-id" });
        onReady.mockImplementation((callback: () => void) =>
            (callback as () => void)()
        );
        // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
        const initializeDatadog = require("./initializeDatadog").default;
        initializeDatadog();
        const initCall = init.mock.calls[0][0];
        const beforeSendFunction = initCall.beforeSend;
        const mockEvent = { context: { existingKey: "existingValue" } };
        beforeSendFunction(mockEvent);
        expect(mockEvent.context).toEqual({
            existingKey: "existingValue",
            gaSessionId: "mocked-ga4-session-id"
        });
    });

    it("should register session ID with Mixpanel after Datadog onReady", async () => {
        process.env.NEXT_PUBLIC_DATADOG_ENV = "development";
        process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID = "test-app-id";
        process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN = "test-client-token";
        const { getInternalContext, onReady } = getDatadogRumMocks();
        getInternalContext.mockReturnValue({ session_id: "mocked-session-id" });
        onReady.mockImplementation((callback: () => void) =>
            (callback as () => void)()
        );
        // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
        const initializeDatadog = require("./initializeDatadog").default;
        const mixpanelService =
            // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
            require("Services/mixpanel/initializeMixPanel").default;
        initializeDatadog();
        await new Promise(process.nextTick);
        expect(mixpanelService.registerSuperProperties).toHaveBeenCalledWith({
            datadog_session_id: "mocked-session-id"
        });
    });

    it("should not initialize Datadog multiple times", () => {
        process.env.NEXT_PUBLIC_DATADOG_ENV = "development";
        process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID = "test-app-id";
        process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN = "test-client-token";
        const { init, getInternalContext, onReady } = getDatadogRumMocks();
        getInternalContext.mockReturnValue({ session_id: "mocked-session-id" });
        onReady.mockImplementation((callback: () => void) =>
            (callback as () => void)()
        );
        // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
        const initializeDatadog = require("./initializeDatadog").default;
        initializeDatadog();
        const firstInitCallCount = init.mock.calls.length;
        initializeDatadog();
        const secondInitCallCount = init.mock.calls.length;
        expect(secondInitCallCount).toBe(firstInitCallCount);
    });

    it("should handle missing internal context in onReady callback", async () => {
        process.env.NEXT_PUBLIC_DATADOG_ENV = "development";
        process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID = "test-app-id";
        process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN = "test-client-token";
        const { getInternalContext, onReady } = getDatadogRumMocks();
        getInternalContext.mockReturnValueOnce(null);
        onReady.mockImplementation((callback: () => void) =>
            (callback as () => void)()
        );
        // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
        const initializeDatadog = require("./initializeDatadog").default;
        const mixpanelService =
            // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
            require("Services/mixpanel/initializeMixPanel").default;
        initializeDatadog();
        await new Promise(process.nextTick);
        expect(mixpanelService.registerSuperProperties).not.toHaveBeenCalled();
    });
});
