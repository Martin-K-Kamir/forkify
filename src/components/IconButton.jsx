import Button from "./Button.jsx";
import React from "react";

const IconButton = ({ children, padSize = null, loadingIconSize, ...rest }) => {
    const fontSize = children.props.className
        ?.split(" ")
        .find(str => str.includes("f-size-"));

    return (
        <Button
            {...rest}
            isIconButton={true}
            padSize={padSize}
            fontSize="sm"
            loadingIconSize={loadingIconSize ?? fontSize}
        >
            {children}
        </Button>
    );
};

export default IconButton;
