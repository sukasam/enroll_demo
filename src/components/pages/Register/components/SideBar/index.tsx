/** @jsxImportSource @emotion/react */
import { Children, ReactNode, cloneElement, isValidElement } from "react";
import styles from "./styles";

interface SideBarProps {
    children?: ReactNode;
    // additionalProps?: { [key: string]: any }; // Object to hold additional props
}

function SideBar({
    children
}: // additionalProps = {}
SideBarProps): JSX.Element | null {
    if (!children) {
        return null;
    }

    const childrenWithProps = Children.map(children, child => {
        if (isValidElement(child)) {
            // return cloneElement(child, additionalProps);
            return cloneElement(child);
        }
        return child;
    });

    return <div css={styles}>{childrenWithProps}</div>;
}
export default SideBar;
