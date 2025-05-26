import { Tooltip } from "@mui/material";
import Image from "next/image";

type Placement =
    | "bottom-end"
    | "bottom-start"
    | "bottom"
    | "left-end"
    | "left-start"
    | "left"
    | "right-end"
    | "right-start"
    | "right"
    | "top-end"
    | "top-start"
    | "top";

type InfoTooltipProps = {
    content: string;
    placement?: Placement;
    style?: React.CSSProperties;
};

function InfoTooltip({
    content,
    placement = "top",
    style
}: InfoTooltipProps): React.ReactNode {
    return (
        <Tooltip
            placement={placement}
            arrow
            style={style}
            title={content}
            enterTouchDelay={0}
            leaveTouchDelay={5000}
        >
            <span style={{ display: "inline-flex" }}>
                <Image
                    src="/info-alt.svg"
                    alt="Info icon"
                    data-testid="tooltip_icon"
                    width={20}
                    height={20}
                />
            </span>
        </Tooltip>
    );
}

export default InfoTooltip;
