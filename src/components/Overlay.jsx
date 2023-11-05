import classNames from "classnames";
import { useEffect, useRef } from "react";
import Icon from "./Icon.jsx";
import { createPortal } from "react-dom";

const Overlay = ({
    children,
    onClose,
    renderClose,
    isVisible,
    className,
    center,
}) => {
    const overlayRef = useRef(null);

    const classes = classNames(
        "fixed inset-0 z-index-800 backdrop-blur-md bg-zinc-950/90 overflow-auto px-m pb-m flex justify-content-center transition-opacity",
        {
            "align-items-start": !center,
            "align-items-center": center,
            "align-items-center//above-sm": center === "above-sm",
            "align-items-center//above-md": center === "above-md",
            "align-items-center//above-lg": center === "above-lg",
            "align-items-center//below-sm": center === "below-sm",
            "align-items-center//below-md": center === "below-md",
            "align-items-center//below-lg": center === "below-lg",
            "pt-l": renderClose && !center,
        },
        className
    );

    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = "hidden";
            document.addEventListener("click", handleClick);
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            console.log("unmount");
            document.body.style.overflow = "auto";
            document.removeEventListener("click", handleClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isVisible]);

    const handleClick = e => {
        if (e.target === overlayRef.current) {
            onClose();
        }
    };

    const handleEscape = e => {
        if (e.key === "Escape") {
            onClose();
        }
    };

    return createPortal(
        <div ref={overlayRef} className={classes} data-opacity={isVisible}>
            {renderClose && (
                <button
                    className="absolute z-index-1 top-xs right-xs text-zinc-200"
                    onClick={onClose}
                >
                    <Icon type="close" className="f-size-3 flex-shrink-0" />
                </button>
            )}
            {children}
        </div>,
        document.getElementById("modal")
    );
};

export default Overlay;
