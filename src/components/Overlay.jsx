import classNames from "classnames";
import { useEffect } from "react";
import Icon from "./Icon.jsx";
import { createPortal } from "react-dom";

const Overlay = ({children, onClose, showClose, isVisible, transition, className, center, ...rest}) => {

    const classes = classNames(
        "fixed inset-0 z-index-800 backdrop-blur-md bg-zinc-950/90 flex justify-content-center",
        {
            "align-items-start": !center,
            "align-items-center": center,
            "align-items-center//above-sm": center === "above-sm",
            "align-items-center//above-md": center === "above-md",
            "align-items-center//above-lg": center === "above-lg",
            "align-items-center//below-sm": center === "below-sm",
            "align-items-center//below-md": center === "below-md",
            "align-items-center//below-lg": center === "below-lg",
            "transition-opacity": transition,
            "pt-l": showClose && !center,
        },
        className
    );

    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = "hidden";
        }

        return () => {
            delete document.body.style.overflow;
        };
    }, [isVisible]);

    return createPortal(
        <div className={classes} data-opacity={isVisible}>
            {showClose && (
                <button
                    className="absolute z-index-1 top-xs right-xs text-zinc-200"
                    onClick={onClose}
                >
                    <Icon
                        type="close"
                        className="f-size-3 flex-shrink-0"
                    />
                </button>
            )}
            {children}
        </div>,
        document.getElementById("overlay")
    );
};

export default Overlay;
