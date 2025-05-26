import { fireEvent, render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import TextField from "./index";

// Mock the useTranslate hook
jest.mock("Components/shared/Translate", () => ({
    useTranslate: (): ((key: string) => string) => (key: string) => key
}));

type FormValues = {
    testField: string;
};

function TestComponent({
    defaultValues = {
        testField: ""
    },
    type = "text",
    capitalize = false,
    rules = {}
}: {
    defaultValues?: FormValues;
    type?: string;
    capitalize?: boolean;
    rules?: any;
}): JSX.Element {
    const { control } = useForm<FormValues>({ defaultValues });
    return (
        <TextField<FormValues>
            name="testField"
            label="Test Label"
            control={control}
            type={type}
            capitalize
            rules={rules}
        />
    );
}

describe("TextField", () => {
    it("renders with label", () => {
        render(<TestComponent />);
        expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    });

    it("handles text input", () => {
        render(<TestComponent />);
        const input = screen.getByLabelText("Test Label");
        fireEvent.change(input, { target: { value: "Test Input" } });
        expect(input).toHaveValue("TEST INPUT");
    });

    it("shows password toggle for password fields", () => {
        render(<TestComponent type="password" />);
        expect(
            screen.getByLabelText("toggle password visibility")
        ).toBeInTheDocument();
    });

    it("toggles password visibility", () => {
        render(<TestComponent type="password" />);
        const input = screen.getByLabelText("Test Label");
        const toggleButton = screen.getByLabelText(
            "toggle password visibility"
        );

        expect(input).toHaveAttribute("type", "password");
        fireEvent.click(toggleButton);
        expect(input).toHaveAttribute("type", "text");
        fireEvent.click(toggleButton);
        expect(input).toHaveAttribute("type", "password");
    });

    it("capitalizes input when capitalize prop is true", () => {
        render(<TestComponent capitalize />);
        const input = screen.getByLabelText("Test Label");
        fireEvent.change(input, { target: { value: "test input" } });
        expect(input).toHaveValue("TEST INPUT");
    });
});
