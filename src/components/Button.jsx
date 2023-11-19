import classnames from "classnames";
import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";
import { useEffect, useRef } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";

const Button = ({
    children,
    to,
    href,
    variant = "contained",
    fontSize = "md",
    padSize = "md",
    color = "primary",
    align = "center",
    bold,
    rounded,
    loading,
    loadingIconSize,
    loadingContent,
    loadingPosition,
    startIcon,
    endIcon,
    onlyIcon,
    isIconButton,
    className,
    srOnly,
    hover,
    disableRipple,
    ...rest
}) => {
    const ref = useRef(null);
    const isMouse = useMediaQuery("(hover) and (pointer: fine)");

    const buttonClasses = classnames(
        "button flex-inline align-items-center",
        {
            "justify-content-center": align === "center",
            "justify-content-start": align === "start",
            "justify-content-end": align === "end",
            "f-weight-medium": bold && !isIconButton,
            "radius-1": !rounded,
            "radius-circle":
                rounded === "circle" || (isIconButton && variant === "text"),
            "radius-pill": rounded === "pill",
            "f-size--1": fontSize === "sm",
            "f-size-1": fontSize === "md",
            "f-size-2": fontSize === "lg",
            "gap-2xs": fontSize === "sm" && !isIconButton,
            "gap-xs": fontSize === "md" && !isIconButton,
            "gap-s": fontSize === "lg" && !isIconButton,
            "px-s py-xs":
                padSize === "sm" && variant !== "text" && !isIconButton,
            "px-m py-xs":
                padSize === "md" && variant !== "text" && !isIconButton,
            "px-m py-s":
                padSize === "lg" && variant !== "text" && !isIconButton,
            "p-3xs": padSize === "sm" && isIconButton,
            "p-2xs": padSize === "md" && isIconButton,
            "p-xs": padSize === "lg" && isIconButton,
            "bg-transparent": variant === "text",
            "text-blue-500": color === "primary" && variant === "text",
            "text-zinc-050": color === "secondary" && variant === "text",
            "bg-blue-700 text-zinc-050":
                color === "primary" && variant === "contained",
            "bg-zinc-800 text-zinc-050":
                color === "secondary" && variant === "contained",
            "bg-red-800 text-zinc-050":
                color === "error" && variant === "contained",
            "bg-green-700 text-zinc-050":
                color === "success" && variant === "contained",
            "bg-yellow-600 text-zinc-050":
                color === "warning" && variant === "contained",
            [color]: color && !["primary", "secondary"].includes(color),
            [fontSize]: fontSize && !["sm", "md", "lg"].includes(fontSize),
            [padSize]: padSize && !["sm", "md", "lg"].includes(padSize),
        },
        className
    );

    const loadingIconClasses = classnames(
        "animation-spin",
        {
            "f-size-1": fontSize === "sm" && !loadingIconSize,
            "f-size-2": fontSize === "md" && !loadingIconSize,
            "f-size-3": fontSize === "lg" && !loadingIconSize,
        },
        loadingIconSize
    );

    const contentClasses = classnames("flex", {
        "opacity-0 invisible": loading && !loadingPosition,
    });

    const Component = to ? Link : href ? "a" : "button";

    useEffect(() => {
        if (disableRipple || !isMouse) return;
        ref.current.addEventListener("click", ripple);

        return () => {
            ref.current?.removeEventListener("click", ripple);
        };
    }, [disableRipple, isMouse]);

    const LoadingContent = () => {
        return (
            loadingContent ?? (
                <Icon type="progressActivity" className={loadingIconClasses} />
            )
        );
    };

    const iconStart =
        !loading && loadingPosition === "start" ? (
            <LoadingContent />
        ) : (
            startIcon
        );

    const content = !onlyIcon && children;

    const iconEnd =
        loading && loadingPosition === "end" ? <LoadingContent /> : endIcon;

    const ripple = e => {
        const button = e.currentTarget;
        const { width, height, left, top } = button.getBoundingClientRect();

        const x = e.clientX - left;
        const y = e.clientY - top;

        const ripple = document.createElement("span");
        ripple.className = "ripple";
        ripple.style.width = `${Math.max(width, height)}px`;
        ripple.style.height = `${Math.max(width, height)}px`;
        ripple.style.left = `${x - ripple.offsetWidth / 2}px`;
        ripple.style.top = `${y - ripple.offsetHeight / 2}px`;

        const rippleWrapper = button.querySelector(".ripple-wrapper");
        rippleWrapper.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 500);
    };

    return (
        <Component
            {...rest}
            ref={ref}
            href={href}
            to={to}
            className={buttonClasses}
            data-variant={variant}
            data-icon-button={isIconButton}
            data-hover={hover}
        >
            {startIcon && <span className={contentClasses}>{iconStart}</span>}
            {content && <span className={contentClasses}>{content}</span>}
            {iconEnd && <span className={contentClasses}>{iconEnd}</span>}
            {loading && !loadingPosition && (
                <span className="absolute">
                    <LoadingContent />
                </span>
            )}
            {srOnly && (
                <span className="sr-only">{loading ? "Loading" : srOnly}</span>
            )}
            {!disableRipple && isMouse && (
                <span
                    className="ripple-wrapper w-full h-full absolute overflow-hidden radius-inherit content-box"
                    aria-hidden="true"
                ></span>
            )}
        </Component>
    );
};

export default Button;
