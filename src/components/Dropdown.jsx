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
    backgroundClassName = "bg-gray-100 bg-zinc-850//dark",
    arrowClassName = "text-gray-100 text-zinc-850//dark",
}) => {
    const ref = useRef(null);
    const childrenRef = useRef(null);

    const classes = classnames(
        "radius-1 shadow-2xl",
        className,
        backgroundClassName
    );

    const wrapperClasses = classnames("relative flex", {
        "justify-content-center": !align || align === "center",
        "justify-content-start": align === "left",
        "justify-content-end": align === "right",
    });

    const arrowWrapperClasses = classnames(
        "w-full flex",
        {
            "justify-content-center": !align || align === "center",
            "justify-content-start": align === "left",
            "justify-content-end": align === "right",
        },
        arrowClassName
    );

    const arrowIconClasses = classnames(
        "absolute top translate--y-half pointer-events-none z-index--1",
        {
            "translate--x-15": align === "left",
            "translate-x-15": align === "right",
        }
    );

    useEffect(() => {
        if (!isVisible) return;

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
                    className="flex flex-direction-column absolute bottom--xs w-full min-w-max translate-y-full z-index-600"
                >
                    <div className={arrowWrapperClasses}>
                        <Icon
                            type="arrowDropUp"
                            className={arrowIconClasses}
                            width="2.5rem"
                            height="2.5rem"
                        />
                    </div>
                    <div className={classes}>{render()}</div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
