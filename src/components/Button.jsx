import classnames from "classnames";
import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";

const Button = ({
    children,
    to,
    href,
    variant = "contained",
    fontSize = "md",
    padSize = "md",
    color = "primary",
    bold,
    rounded,
    loading,
    loadingIconSize,
    loadingContent,
    loadingPosition,
    startIcon,
    endIcon,
    onlyIcon,
    className,
    ...rest
}) => {
    const buttonClasses = classnames(
        "button flex-inline align-items-center justify-content-center line-height-1",
        {
            "f-weight-medium": bold,
            "radius-1": !rounded,
            "radius-circle": rounded === "circle",
            "radius-pill": rounded === "pill",
            "f-size--1": fontSize === "sm",
            "f-size-1": fontSize === "md",
            "f-size-2": fontSize === "lg",
            "gap-2xs": fontSize === "sm",
            "gap-xs": fontSize === "md",
            "gap-s": fontSize === "lg",
            "px-s py-xs": padSize === "sm" && variant !== "text",
            "px-m py-xs": padSize === "md" && variant !== "text",
            "px-m py-s": padSize === "lg" && variant !== "text",
            "bg-transparent": variant === "text",
            "text-blue-500": color === "primary" && variant === "text",
            "text-zinc-050": color === "secondary" && variant === "text",
            "bg-blue-700 text-zinc-050":
                color === "primary" && variant === "contained",
            "bg-zinc-800 text-zinc-050":
                color === "secondary" && variant === "contained",
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

    const contentClasses = classnames("flex",{
        "opacity-0 invisible": loading && !loadingPosition,
    });

    const Component = to ? Link : href ? "a" : "button";

    const LoadingContent = () => {
        return (
            loadingContent ?? (
                <Icon type="progressActivity" className={loadingIconClasses}/>
            )
        )
    }

    const iconStart =
        !loading && loadingPosition === "start" ? <LoadingContent /> : startIcon;

    const content = !onlyIcon && children;

    const iconEnd =
        loading && loadingPosition === "end" ? <LoadingContent /> : endIcon;

    return (
        <Component {...rest} href={href} to={to} className={buttonClasses}>
            {startIcon && <span className={contentClasses}>{iconStart}</span>}
            {content && <span className={contentClasses}>{content}</span>}
            {iconEnd && <span className={contentClasses}>{iconEnd}</span>}
            {loading && !loadingPosition && (
                <span className="absolute">
                    <LoadingContent />
                </span>
            )}
        </Component>
    );
};

export default Button;
