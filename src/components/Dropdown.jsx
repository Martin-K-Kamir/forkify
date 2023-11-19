import Icon from "./Icon.jsx";
import React, { useEffect, useRef } from "react";
import classnames from "classnames";

const Dropdown = ({
    children,
    render,
    isVisible,
    onOutsideClick,
    align,
    className,
    backgroundClassName,
}) => {
    const ref = useRef(null);
    const childrenRef = useRef(null);
    const arrowRef = useRef(null);
    const contentRef = useRef(null);

    const classes = classnames(
        "radius-1",
        {
            "bg-zinc-850": !backgroundClassName,
        },
        backgroundClassName,
        className
    );

    const wrapperClasses = classnames("relative flex", {
        "justify-content-center": !align || align === "center",
        "justify-content-start": align === "left",
        "justify-content-end": align === "right",
    });

    const arrowWrapperClasses = classnames("w-full flex", {
        "justify-content-center": !align || align === "center",
        "justify-content-start": align === "left",
        "justify-content-end": align === "right",
    });

    const arrowIconClasses = classnames(
        "absolute top translate--y-half pointer-events-none z-index--1",
        {
            "translate--x-15": align === "left",
            "translate-x-15": align === "right",
        }
    );

    useEffect(() => {
        if (!isVisible) return;
        const { backgroundColor } = getComputedStyle(contentRef.current);

        Object.assign(arrowRef.current.style, {
            color: backgroundColor,
        });

        document.addEventListener("click", handleClick, true);

        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, [isVisible]);

    const handleClick = e => {
        if (
            e.target !== ref.current &&
            e.target !== childrenRef.current &&
            !ref.current?.contains(e.target) &&
            !childrenRef.current?.contains(e.target)
        ) {
            onOutsideClick();
        }
    };

    return (
        <div className={wrapperClasses}>
            <div ref={childrenRef}>{children}</div>
            {isVisible && (
                <div
                    ref={ref}
                    className="flex flex-direction-column absolute bottom--s w-full min-w-max shadow-2xl translate-y-full"
                >
                    <div ref={arrowRef} className={arrowWrapperClasses}>
                        <Icon
                            type="arrowDropUp"
                            className={arrowIconClasses}
                            width="2.5rem"
                            height="2.5rem"
                        />
                    </div>
                    <div ref={contentRef} className={classes}>
                        {render()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
