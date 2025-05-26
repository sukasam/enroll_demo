import { Id, toast, ToastOptions, ToastPosition } from "react-toastify";

export type ToastType = "success" | "error" | "info" | "warning";
type ToastContent = string | React.ReactNode;

const baseConfig: ToastOptions = {
    position: "top-right" as ToastPosition,
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false
};

const typeConfig: Record<ToastType, ToastOptions> = {
    success: { icon: "✅" as any, autoClose: 5000 },
    error: { icon: "❌" as any, autoClose: false },
    warning: { icon: "⚠️" as any, autoClose: 5000 },
    info: { icon: "ℹ️" as any, autoClose: 5000 }
};

let errorToastIds: Id[] = [];

const showToast = (
    content: ToastContent,
    type: ToastType = "info",
    options: ToastOptions = {}
): void => {
    const toastOptions = { ...baseConfig, ...typeConfig[type], ...options };

    const renderContent = (): React.ReactNode => {
        if (typeof content === "string") {
            return <div dangerouslySetInnerHTML={{ __html: content }} />;
        }
        return content;
    };

    const toastId = toast[type](renderContent(), toastOptions);

    if (type === "error") {
        errorToastIds.push(toastId);
    }
};

export const dismissAllErrorToasts = (): void => {
    errorToastIds.forEach(id => toast.dismiss(id));
    errorToastIds = [];
};

export default showToast;
