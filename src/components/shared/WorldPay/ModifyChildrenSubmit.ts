import { OrderResult } from "Contexts/types/OrderContextTypes";
import React, { ReactNode } from "react";

export default function modifyChildrenSubmit(
    children: ReactNode,
    modifiedHandleSubmit: (
        originalHandleSubmit: () => Promise<OrderResult>
    ) => void
): ReactNode {
    // Function to modify the handleSubmit prop of a child component
    const modifyHandleSubmit = (child: ReactNode): ReactNode => {
        if (!React.isValidElement(child)) return child;

        const originalHandleSubmit = child.props.onClick;

        // Clone the child element with the modified handleSubmit prop
        return React.cloneElement(
            child as React.ReactElement<{ onClick?: () => void }>,
            {
                onClick: () => {
                    modifiedHandleSubmit(originalHandleSubmit);
                }
            }
        );
    };

    // Map over the children and modify the onClick prop
    const modifiedChildren = React.Children.map(children, modifyHandleSubmit);
    return modifiedChildren;
}
