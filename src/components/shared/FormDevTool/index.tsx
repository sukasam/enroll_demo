import { DevTool } from "@hookform/devtools";
import { Control, FieldValues } from "react-hook-form";
import httpTools from "Shared/httpTools";

interface FormDevToolProps<T extends FieldValues> {
    control: Control<T>;
}

function FormDevTool<T extends FieldValues>({
    control
}: FormDevToolProps<T>): JSX.Element | null {
    return httpTools.isProd ? null : <DevTool control={control} />;
}

export default FormDevTool;
