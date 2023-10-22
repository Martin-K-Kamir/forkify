import { Link } from "react-router-dom";
import Icon from "../Icon.jsx";
import className from "classnames";

const NavigationListItem = ({
    url,
    onClick,
    icon,
    label,
    ariaOptions,
    ...rest
}) => {
    const ButtonType = Boolean(url) ? Link : "button";

    const buttonClasses = className(
        "flex align-items-center gap-3xs f-size--1 text-zinc-050 text-no-decoration line-height-1",
        rest.className
    );

    const iconClasses = className("f-size-2", rest.iconClassName);

    return (
        <li key={label}>
            <ButtonType
                className={buttonClasses}
                to={url}
                onClick={onClick}
                {...ariaOptions}
            >
                <Icon className={iconClasses} type={icon} />
                {label}
            </ButtonType>
        </li>
    );
};

export default NavigationListItem;
