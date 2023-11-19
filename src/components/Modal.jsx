import Overlay from "./Overlay.jsx";
import classnames from "classnames";
import Icon from "./Icon.jsx";
import { useMediaQuery } from "@uidotdev/usehooks";
import IconButton from "./IconButton.jsx";
import React from "react";

const Modal = ({
    children,
    renderFooter,
    renderHeader,
    className,
    clearClassName,
    backgroundClassName,
    isCloseRendered,
    ...rest
}) => {
    const isAboveMd = useMediaQuery("(width >= 48em)");
    const isBelowMd = useMediaQuery("(width < 48em)");

    const classes = classnames(
        "radius-1 w-full mx-auto transition-fade-up",
        {
            "max-w-xl mt-m p-fluid-m-l": !clearClassName,
            "bg-zinc-850": !backgroundClassName,
        },
        className,
        backgroundClassName
    );

    return (
        <Overlay {...rest} isCloseRendered={isCloseRendered && isAboveMd}>
            <div className={classes} data-fade-up={rest.isVisible}>
                {isCloseRendered && isBelowMd && (
                    <IconButton
                        variant="text"
                        color="text-zinc-300"
                        className="absolute z-index-1 top-2xs right-2xs"
                        onClick={rest.onClose}
                        srOnly="Close modal"
                        hover="absolute"
                    >
                        <Icon type="close" className="f-size-2 flex-shrink-0" />
                    </IconButton>
                )}
                {children}
            </div>
        </Overlay>
    );
};

export default Modal;
