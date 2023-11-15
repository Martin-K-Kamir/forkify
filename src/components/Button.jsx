import classnames from "classnames";
import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";

const Button = ({
                    children,
                    to,
                    href,
                    variant,
                    size,
                    rounded,
                    loading,
                    loadingContent,
                    loadingPosition,
                    startIcon,
                    endIcon,
                    onlyIcon,
                    className,
                    ...rest
                }) => {

    const buttonClasses = classnames("button flex-inline align-items-center justify-content-center", {
        "radius-1": !rounded,
        "radius-circle": rounded,
    }, className)

    const contentClasses = classnames({
        "opacity-0 invisible": loading && !loadingPosition,
    })

    const Component = to ? Link : href ? "a" : "button"

    const LoadingContent = () => (
        loadingContent ?? <Icon
            type="progressActivity"
            className="animation-spin"
        />
    );

    const iconStart = loading && loadingPosition === "start" ? (
        <LoadingContent />
    ) : startIcon;

    const content = !onlyIcon && children;

    const iconEnd = loading && loadingPosition === "end" ? (
        <LoadingContent />
    ) : endIcon;

    return (
        <Component  {...rest} href={href} to={to} className={buttonClasses} >
            <span className={contentClasses}>
                {iconStart}
            </span>
            <span className={contentClasses}>
                {content}
            </span>
            <span className={contentClasses}>
                {iconEnd}
            </span>
            {loading && !loadingPosition && (
                <span className="absolute">
                    <LoadingContent/>
                </span>
            )}
        </Component>
    )
}

export default Button