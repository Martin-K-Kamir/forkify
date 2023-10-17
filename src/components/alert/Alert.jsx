import { createPortal } from "react-dom";
import "./Alert.css";
import className from "classnames";
import Icon from "../Icon.jsx";
import { useEffect, useState } from "react";

const AlertContent = ({
    children,
    success,
    danger,
    warning,
    info,
    onClose,
    ...rest
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setIsVisible(true);
        }, 100);
    }, []);

    const handleClick = () => {
        setIsVisible(false);

        setTimeout(() => {
            onClose();
        }, 400);
    };

    const classes = className(
        "flex align-items-center gap-fluid-xs-s max-w-m w-full px-fluid-s-m py-fluid-xs-s radius-1 f-size-fluid-1 f-weight-medium",
        rest.className,
        {
            "bg-green-050 text-green-900": success,
            "bg-red-050 text-red-900": danger,
            "bg-yellow-100 text-yellow-700": warning,
            "bg-blue-050 text-blue-900": info,
        }
    );

    const iconClasses = className("f-size-fluid-2 flex-shrink-0");

    let icon;
    if (success) {
        icon = <Icon type="checkCircleOutline" className={iconClasses} />;
    } else if (danger) {
        icon = <Icon type="cancelOutline" className={iconClasses} />;
    } else if (warning) {
        icon = <Icon type="warningOutline" className={iconClasses} />;
    } else if (info) {
        icon = <Icon type="infoOutline" className={iconClasses} />;
    }

    return createPortal(
        <div className="alert w-full" data-visible={isVisible}>
            <div className="wrapper flex justify-content-center">
                <div className={classes}>
                    {icon}
                    {children}
                    <button
                        className="button-close ml-auto line-height-1"
                        onClick={handleClick}
                    >
                        <Icon
                            type="close"
                            className="f-size-fluid-2 flex-shrink-0"
                        />
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById("alert")
    );
};

const Alert = props => {
    return <AlertContent {...props} />;
};

export default Alert;
