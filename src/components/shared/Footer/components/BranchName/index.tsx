export default function BranchName(): JSX.Element | null {
    const branchName = process.env.NEXT_PUBLIC_BRANCH_NAME;
    const isProd = process.env.NEXT_PUBLIC_APP_ENV === "production";

    if (isProd) {
        return null;
    }

    return (
        <div
            style={{
                position: "absolute",
                right: 0,
                padding: "5px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                fontSize: "8px"
            }}
        >
            {branchName}
        </div>
    );
}
