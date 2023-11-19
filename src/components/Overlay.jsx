import classNames from "classnames";
import React, { useEffect, useRef } from "react";
import Icon from "./Icon.jsx";
import { createPortal } from "react-dom";
import IconButton from "./IconButton.jsx";
import { useMediaQuery } from "@uidotdev/usehooks";

const Overlay = ({
    children,
    onClose,
    isCloseRendered,
    isVisible,
    className,
    center,
}) => {
    const ref = useRef(null);
    const isAboveSm = useMediaQuery("(width >= 30em)");

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
            "pt-l": isCloseRendered && !center && isAboveSm,
            "pt-m": isCloseRendered && !center && !isAboveSm,
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
            document.body.style.overflow = "auto";
            document.removeEventListener("click", handleClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isVisible]);

    const handleClick = e => {
        if (e.target === ref.current) {
            onClose();
        }
    };

    const handleEscape = e => {
        if (e.key === "Escape") {
            onClose();
        }
    };

    return createPortal(
        <div
            ref={ref}
            className={classes}
            data-opacity={isVisible}
            aria-modal="true"
            role="dialog"
            aria-labelledby="modal-title"
            aria-live="polite"
        >
            {isCloseRendered && (
                <IconButton
                    variant="text"
                    color="text-zinc-300"
                    className="absolute z-index-1 top-2xs right-2xs"
                    onClick={onClose}
                    srOnly="Close modal"
                    hover="absolute"
                >
                    <Icon
                        type="close"
                        className="f-size-2 f-size-3//above-sm flex-shrink-0"
                    />
                </IconButton>
            )}
            {children}
        </div>,
        document.getElementById("modal")
    );
};

export default Overlay;
