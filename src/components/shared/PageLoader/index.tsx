import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

function PageLoader(): React.ReactElement {
    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                zIndex: 1500
            }}
        >
            <CircularProgress sx={{ color: "#5a8fc4" }} thickness={5} />
        </Box>
    );
}

export default PageLoader;
