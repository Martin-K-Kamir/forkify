import Overlay from "./Overlay.jsx";
import classnames from "classnames";
import Icon from "./Icon.jsx";
import { useMediaQuery } from "@uidotdev/usehooks";
import IconButton from "./IconButton.jsx";
import React from "react";
import { ABOVE_MD, BELOW_MD } from "../app/config.js";

const Modal = ({
    children,
    renderFooter,
    renderHeader,
    className,
    backgroundClassName,
    isCloseRendered,
    ...rest
}) => {
    const isAboveMd = useMediaQuery(ABOVE_MD);
    const isBelowMd = useMediaQuery(BELOW_MD);

    const classes = classnames(
        "radius-1 w-full mx-auto transition-fade-up shadow-2xl",
        {
            "max-w-xl mt-m p-fluid-m-l": !className,
            "bg-gray-050 bg-zinc-800//dark": !backgroundClassName,
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
                        color="text-gray-800 text-zinc-300//dark"
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
