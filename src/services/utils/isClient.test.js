import isClient from "./isClient";

describe("isClient", () => {
    let originalWindow;

    beforeAll(() => {
        originalWindow = global.window;
    });

    afterEach(() => {
        global.window = originalWindow;
    });

    it("should return true when window is defined", () => {
        expect(isClient()).toBe(true);
    });

    it("should return false when window is undefined", () => {
        delete global.window;
        expect(isClient()).toBe(false);
    });

    it("should return false when window is null", () => {
        global.window = null;
        expect(isClient()).toBe(false);
    });
});
