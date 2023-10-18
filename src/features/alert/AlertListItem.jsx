import { selectAlertById } from "./alertSlice.js";
import { useSelector } from "react-redux";
import className from "classnames";
import Icon from "../../components/Icon.jsx";
import { useEffect, useState } from "react";


const AlertListItem = ({alertId}) => {
    const [isVisible, setIsVisible] = useState(false);
    const alert = useSelector(state => selectAlertById(state, alertId))
    const {isSuccess, isDanger, isWarning, isInfo, message} = alert;

    useEffect(() => {
        setTimeout(() => {
            setIsVisible(true);
        }, 100);
    }, []);
    const handleClick = () => {
        setIsVisible(false);
    };

    const classes = className(
        "alert-item flex align-items-center gap-fluid-xs-s max-w-m w-full px-fluid-s-m py-fluid-xs-s radius-1 f-size-fluid-1 f-weight-medium",
        {
            "bg-green-050 text-green-900": isSuccess,
            "bg-red-050 text-red-900": isDanger,
            "bg-yellow-100 text-yellow-700": isWarning,
            "bg-blue-050 text-blue-900": isInfo,
        }
    );

    const iconClasses = className("f-size-fluid-2 flex-shrink-0");

    let icon;
    if (isSuccess) {
        icon = <Icon type="checkCircleOutline" className={iconClasses}/>;
    } else if (isDanger) {
        icon = <Icon type="cancelOutline" className={iconClasses}/>;
    } else if (isWarning) {
        icon = <Icon type="warningOutline" className={iconClasses}/>;
    } else if (isInfo) {
        icon = <Icon type="infoOutline" className={iconClasses}/>;
    }

    return (
        <div className={classes} data-visible={isVisible}>
            {icon}
            {message}
            <button
                className="button-close ml-auto line-height-1"
            >
                <Icon
                    type="close"
                    className="f-size-fluid-2 flex-shrink-0"
                />
            </button>
        </div>
    )
}

export default AlertListItem;