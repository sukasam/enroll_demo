import { render, RenderResult, screen, waitFor } from "@testing-library/react";
import { UserContextState } from "Contexts/types/UserContextTypes";
import { UserProvider, useUser } from "Contexts/UserContext";
import { getCookie, setCookie } from "cookies-next";
import { Customer } from "Hydra/getRefID";
import { GetServerSidePropsContext } from "next";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import Landing, { getServerSideProps, HomeServerProps } from "./index";

// Mocks
jest.mock("next/router", () => ({
    useRouter: jest.fn(() => ({ prefetch: jest.fn().mockResolvedValue(true) }))
}));

jest.mock("next/image", () => ({
    __esModule: true,
    default: ({
        src,
        alt,
        "data-testid": testId,
        ...props
    }: {
        src: string;
        alt: string;
        "data-testid"?: string;
        [key: string]: any;
    }): JSX.Element => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt={alt}
            data-testid={testId || "next-image"}
            {...props}
        />
    )
}));

jest.mock("Services/mixpanel/initializeMixPanel", () => ({
    trackPageView: jest.fn(),
    registerSuperProperties: jest.fn()
}));

jest.mock("Contexts/UserContext", () => ({
    ...jest.requireActual("Contexts/UserContext"),
    useUser: jest.fn()
}));

jest.mock("cookies-next", () => ({
    getCookie: jest.fn(),
    setCookie: jest.fn(),
    deleteCookie: jest.fn()
}));

jest.mock("Services/geoip", () => ({
    __esModule: true,
    default: jest.fn().mockResolvedValue({ alpha2: "US", language: "en" })
}));

jest.mock("Services/utils/refValidation", () => ({
    __esModule: true,
    default: jest.fn().mockResolvedValue({
        isValid: true,
        unicityID: "12345",
        refResults: { humanName: { firstName: "John", lastName: "Doe" } }
    })
}));

jest.mock("./components/HomeContent", () => ({
    __esModule: true,
    default: jest.fn(() => <div data-testid="mock-home-content" />)
}));

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;

describe("Landing", () => {
    const defaultProps: HomeServerProps = {
        referrer: null,
        refId: null,
        country: "US",
        language: "en"
    };
    const setup = (props: Partial<HomeServerProps> = {}): RenderResult =>
        render(
            <UserProvider>
                <Landing {...{ ...defaultProps, ...props }} />
            </UserProvider>
        );

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseUser.mockReturnValue({
            setEnrollerId: jest.fn(),
            setSponsorId: jest.fn(),
            setEnrollerFullName: jest.fn(),
            setSponsorFullName: jest.fn(),
            isUserContextLoading: false
        } as Partial<UserContextState> as UserContextState);
    });

    it("renders correctly without referrer", () => {
        const { asFragment } = setup();
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders correctly with referrer", () => {
        const referrer: Partial<Customer> = {
            humanName: {
                firstName: "John",
                lastName: "Doe",
                fullName: "John Doe",
                "fullName@fr": "John Doe"
            },
            mainAddress: { country: "US" },
            unicity: 12345,
            href: "http://example.com/customer"
        };
        const { asFragment } = setup({
            referrer: referrer as Customer,
            refId: "123"
        });
        expect(asFragment()).toMatchSnapshot();
    });

    it("tracks page view", async () => {
        setup();
        await waitFor(() => {
            expect(mixpanelService.trackPageView).toHaveBeenCalledWith("home");
        });
    });

    it("renders HomeContent and Aside components", () => {
        setup();
        expect(screen.getByTestId("mock-home-content")).toBeInTheDocument();
        expect(
            screen.getByTestId("starting_business_just_become_easier_section")
        ).toBeInTheDocument();
    });

    it("sets user context when referrer and refId are provided", () => {
        const referrer: Partial<Customer> = {
            humanName: {
                firstName: "John",
                lastName: "Doe",
                fullName: "John Doe",
                "fullName@fr": "John Doe"
            },
            unicity: 12345
        };
        setup({ referrer: referrer as Customer, refId: "12345" });
        expect(mockUseUser().setEnrollerId).toHaveBeenCalledWith("12345");
        expect(mockUseUser().setSponsorId).toHaveBeenCalledWith("12345");
        expect(mockUseUser().setEnrollerFullName).toHaveBeenCalledWith(
            "John Doe"
        );
        expect(mockUseUser().setSponsorFullName).toHaveBeenCalledWith(
            "John Doe"
        );
    });
});

describe("getServerSideProps", () => {
    const mockContext = { req: {} } as GetServerSidePropsContext;

    beforeEach(() => {
        jest.clearAllMocks();
        (getCookie as jest.Mock).mockImplementation(
            (key: string) =>
                ({ country: "US", language: "en", refId: null }[key] || null)
        );
    });

    it("returns null referrer and refId when no refId cookie", async () => {
        const result = await getServerSideProps(mockContext);
        expect(result).toEqual({
            props: {
                country: "US",
                language: "en",
                referrer: null,
                refId: null
            }
        });
    });

    it("sets country and language cookies based on geolocation", async () => {
        await getServerSideProps(mockContext);
        expect(setCookie).toHaveBeenCalledWith("country", "US", mockContext);
        expect(setCookie).toHaveBeenCalledWith("language", "en", mockContext);
    });
});
