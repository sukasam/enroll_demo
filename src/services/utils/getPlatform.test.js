import getPlatform from "./getPlatform";

describe("getPlatform", () => {
    const originalNavigator = global.navigator;
    let mockNavigator;

    beforeEach(() => {
        // Create a mock navigator object
        mockNavigator = {
            userAgent: ""
        };
        // Replace the global navigator with our mock
        Object.defineProperty(global, "navigator", {
            value: mockNavigator,
            writable: true
        });
    });

    afterEach(() => {
        // Restore the original navigator object
        global.navigator = originalNavigator;
    });

    it('should return "Windows 10" for Windows 10 user agent', () => {
        mockNavigator.userAgent =
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
        expect(getPlatform()).toBe("Windows 10");
    });

    it('should return "Android" for Android user agent', () => {
        mockNavigator.userAgent =
            "Mozilla/5.0 (Linux; Android 10; SM-A505F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36";
        expect(getPlatform()).toBe("Android");
    });

    it('should return "iOS" for iPhone user agent', () => {
        mockNavigator.userAgent =
            "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1";
        expect(getPlatform()).toBe("iOS");
    });

    it('should return "MacOS" for Mac user agent', () => {
        mockNavigator.userAgent =
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36";
        expect(getPlatform()).toBe("MacOS");
    });

    it('should return "Linux" for Linux user agent', () => {
        mockNavigator.userAgent =
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36";
        expect(getPlatform()).toBe("Linux");
    });

    it('should return "NA" for unknown user agent', () => {
        mockNavigator.userAgent = "Unknown/1.0";
        expect(getPlatform()).toBe("NA");
    });
});
