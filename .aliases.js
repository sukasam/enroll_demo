const buildAliases = require("./scripts/buildAliases.cjs");

const aliases = {
    App: "./src",
    CMSContentTypes: "./src/components/CMSContentTypes",
    CMSPages: "./src/components/CMSPages",
    Components: "./src/components",
    Config: "./src/config",
    Constants: "./src/constants",
    Contexts: "./src/contexts",
    DotCMS: "./src/dotCMS",
    CMSComponents: "./src/components/dotcms",
    Forms: "./src/components/Forms",
    GlobalLayout: "./src/components/GlobalLayout",
    Hooks: "./src/hooks",
    Hydra: "./src/services/Hydra",
    Modals: "./src/components/Modals",
    Pages: "./src/pages",
    Popovers: "./src/components/Popovers",
    Root: ".",
    GQL: "./src/dotCMS/services/gql",
    Services: "./src/services",
    Shared: "./shared",
    SharedForms: "./src/components/SharedForms",
    Slices: "./src/store/slices",
    Store: "./src/store",
    Styled: "./src/components/Styled",
    StaticPages: "./src/components/StaticPages",
    Styles: "./src/styles",
    Theme: "./src/styles/theme",
    Types: "./src/types",
    Thunks: "./src/store/thunks",
    Utils: "./src/services/utils",
    TestUtils: "./src/services/utils/testUtils.js"
};

module.exports = buildAliases(aliases);
