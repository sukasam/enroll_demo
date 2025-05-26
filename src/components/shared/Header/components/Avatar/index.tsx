import { Avatar as MuiAvatar, SxProps } from "@mui/material";
import { useUser } from "Contexts/UserContext";

function Avatar(): JSX.Element {
    const { userData } = useUser();
    const stringAvatar = (name: string): { sx: SxProps; children: string } => {
        const nameParts = name.split(" ");
        let initials = nameParts[0][0];

        if (nameParts.length > 1 && nameParts[1]) {
            initials += nameParts[1][0];
        }

        return {
            sx: {
                bgcolor: "#75a4d3",
                width: "24px",
                height: "24px",
                fontSize: "12px",
                marginRight: "8px"
            },
            children: initials
        };
    };

    const avatarProps = stringAvatar(userData?.fullName || "");
    return <MuiAvatar sx={avatarProps.sx}>{avatarProps.children}</MuiAvatar>;
}

export default Avatar;
