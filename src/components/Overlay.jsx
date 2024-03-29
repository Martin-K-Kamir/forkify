import classNames from "classnames";
import React, { useEffect, useRef } from "react";
import Icon from "./Icon.jsx";
import { createPortal } from "react-dom";
import IconButton from "./IconButton.jsx";
import { useMediaQuery } from "@uidotdev/usehooks";
import { ABOVE_SM } from "../app/config.js";

const Overlay = ({
    children,
    onClose,
    isCloseRendered,
    isVisible,
    className,
    center,
}) => {
    const ref = useRef(null);
    const lastFocusedElement = useRef(null);
    const isAboveSm = useMediaQuery(ABOVE_SM);

    const classes = classNames(
        "fixed inset-0 z-index-800 none//print backdrop-blur-md bg-gray-800/90 bg-zinc-950/90//dark overflow-auto px-m pb-m flex justify-content-center transition-opacity",
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
            // Disable focusability of all other elements in the DOM
            Array.from(document.body.getElementsByTagName("*")).forEach(el => {
                if (
                    el !== ref.current &&
                    !ref.current.contains(el) &&
                    el.tabIndex >= 0
                ) {
                    el.dataset.oldTabIndex = el.tabIndex;
                    el.tabIndex = -1;
                }
            });

            lastFocusedElement.current = document.activeElement;

            document.body.style.overflow = "hidden";
            document.addEventListener("click", handleClick);
            document.addEventListener("keydown", handleEscape);
            ref.current.focus();
        }

        return () => {
            // Re-enable focusability of all other elements in the DOM
            Array.from(document.body.getElementsByTagName("*")).forEach(el => {
                if (el.dataset.oldTabIndex) {
                    el.tabIndex = el.dataset.oldTabIndex;
                    delete el.dataset.oldTabIndex;
                }
            });

            // Set focus back to the last focused element
            if (document.activeElement === document.body) {
                // Create a temporary focusable element
                const tempElement = document.createElement("button");
                tempElement.style.position = "fixed";
                tempElement.style.opacity = "0";
                document.body.appendChild(tempElement);

                // Focus the temporary element
                tempElement.focus();

                // Remove the temporary element
                document.body.removeChild(tempElement);
            } else {
                lastFocusedElement.current?.focus();
            }

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
            tabIndex="-1"
        >
            {isCloseRendered && (
                <IconButton
                    variant="text"
                    color="text-gray-100 text-zinc-300//dark"
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
