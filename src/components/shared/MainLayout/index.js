/** @jsxImportSource @emotion/react */
import styles from "./styles";

function MainLayout({
    children,
    fullWidth = false,
    background = "#ffffff",
    padding = "0 0px",
    height = "auto",
    display = "block",
    margin = "20px auto 0 auto",
    ...props
}) {
    return (
        <div
            className="layout"
            style={{
                background,
                width: "100%",
                margin: "0 auto",
                padding
            }}
            {...props}
            data-testid="main_layout"
        >
            <main
                css={styles({ display, fullWidth, height, margin })}
                suppressHydrationWarning
            >
                {children}
            </main>
        </div>
    );
}

export default MainLayout;
