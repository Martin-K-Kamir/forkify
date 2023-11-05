import Overlay from "./Overlay.jsx";
import classnames from "classnames";
import Icon from "./Icon.jsx";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useEffect } from "react";

const Modal = ({ children, className, renderClose, ...rest }) => {
    const isAboveMd = useMediaQuery("(width >= 48em)");
    const isBelowMd = useMediaQuery("(width < 48em)");

    const classes = classnames(
        "radius-1 w-full mx-auto transition-fade-up",
        {
            "max-w-xl bg-zinc-900 mt-m p-fluid-m-l": !className,
        },
        className
    );

    useEffect(() => {
        if (rest.isVisible) {
            document.body.style.overflow = "hidden";
        }

        return () => {
            console.log("unmount");
        };
    }, [rest.isVisible]);

    return (
        <Overlay {...rest} renderClose={renderClose && isAboveMd}>
            <div className={classes} data-fade-up={rest.isVisible}>
                {renderClose && isBelowMd && (
                    <button
                        className="absolute z-index-1 top-2xs right-2xs text-zinc-200"
                        onClick={rest.onClose}
                    >
                        <Icon type="close" className="f-size-2 flex-shrink-0" />
                    </button>
                )}
                {children}
            </div>
        </Overlay>
    );
};

export default Modal;
