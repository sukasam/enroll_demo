import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

// Mock TextEncoder/TextDecoder for tests
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
    }))
});

// Custom snapshot serializer to ignore MUI class names
expect.addSnapshotSerializer({
    test: val => typeof val === "string" && val.includes("Mui"),
    print: val => val.replace(/css-[a-zA-Z0-9]+/g, "css-XXXXX")
});
