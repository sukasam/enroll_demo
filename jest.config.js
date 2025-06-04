// eslint-disable-next-line @typescript-eslint/no-var-requires
const aliases = require("./.aliases.js");

function createJestAliases(aliases) {
    return Object.keys(aliases).reduce((jestAliases, alias) => {
        const aliasPath = aliases[alias];
        jestAliases[`^${alias}/(.*)$`] = `${aliasPath}/$1`;
        return jestAliases;
    }, {});
}

const jestAliases = createJestAliases(aliases);

module.exports = {
    moduleDirectories: ["node_modules", "src"],
    testEnvironment: "jsdom",
    rootDir: "./",
    moduleNameMapper: {
        ...jestAliases,
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        "^Components/(.*)$": "<rootDir>/src/components/$1",
        "^Services/(.*)$": "<rootDir>/src/services/$1",
        "^Contexts/(.*)$": "<rootDir>/src/contexts/$1"
    },
    setupFilesAfterEnv: ["./jest.setup.js"],
    collectCoverageFrom: [
        "src/**/*.{js,jsx,ts,tsx}",
        "src/constants/countryConfig/index.ts",
        "!src/constants/**/*.{js,jsx,ts,tsx}",
        "!src/**/types/**/*",
        "!src/styles/**/*",
        "!src/**/*.d.ts",
        "!src/**/types*",
        "!src/**/styles*",
        "!src/**/enums*"
    ],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    maxWorkers: "50%",
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
};
