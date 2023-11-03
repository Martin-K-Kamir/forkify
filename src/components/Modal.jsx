import Overlay from "./Overlay.jsx";
import classnames from "classnames";
import Icon from "./Icon.jsx";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

const Modal = ({children, className, showClose, onClose, ...rest}) => {
    const isAboveMd = useMediaQuery("(width >= 48em)");
    const isBelowMd = useMediaQuery("(width < 48em)");

    const classes = classnames(
        {
            "radius-1 max-w-xl w-full mx-auto bg-zinc-900 mt-m p-fluid-m-l": !rest.overrideClassName,
            "transition-fade-up": rest.transition,
        },
        className
    );

    return (
        <Overlay
            {...rest}
            showClose={showClose && isAboveMd}
        >
            <div className="wrapper">
                <div className={classes} data-fade-up={true}>
                    {showClose && isBelowMd && (
                        <button
                            className="absolute z-index-1 top-2xs right-2xs text-zinc-200"
                            onClick={onClose}
                        >
                            <Icon
                                type="close"
                                className="f-size-3 flex-shrink-0"
                            />
                        </button>
                    )}
                    {children}
                </div>
            </div>
        </Overlay>
    )
};

export default Modal;
