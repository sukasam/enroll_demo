/** @jsxImportSource @emotion/react */
import { ToastContainer, ToastTransition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ToasterProps = {
    position?:
        | "top-right"
        | "top-left"
        | "bottom-right"
        | "bottom-left"
        | "top-center"
        | "bottom-center";
    autoClose?: number | false;
    hideProgressBar?: boolean;
    closeOnClick?: boolean;
    draggable?: boolean;
    pauseOnHover?: boolean;
    transition?: ToastTransition;
    theme?: "light" | "dark" | "colored";
    newestOnTop?: boolean;
    rtl?: boolean;
    pauseOnFocusLoss?: boolean;
};

function Toaster(props: ToasterProps): JSX.Element {
    return <ToastContainer {...props} />;
}

export default Toaster;
