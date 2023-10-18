import { removeAlert, selectAlertById } from "./alertSlice.js";
import { useDispatch, useSelector } from "react-redux";
import className from "classnames";
import Icon from "../../components/Icon.jsx";
import { useEffect, useRef, useState } from "react";

const AlertListItem = ({ alertId }) => {
    const dispatch = useDispatch();

    const [isVisible, setIsVisible] = useState(false);
    const [isExtended, setIsExtended] = useState(true);
    const [maxHeight, setMaxHeight] = useState(0);
    const ref = useRef(null);

    const alert = useSelector(state => selectAlertById(state, alertId));
    const { isSuccess, isDanger, isWarning, isInfo, message } = alert;

    useEffect(() => {
        setMaxHeight(ref.current.scrollHeight);

        setTimeout(() => {
            setIsVisible(true);
        }, 100);

        setTimeout(hideAlert, 3000);
    }, []);

    const hideAlert = () => {
        setIsVisible(false);
        setIsExtended(false);
        setMaxHeight(0);

        setTimeout(() => {
            dispatch(removeAlert(alertId));
        }, 500);
    };

    const classes = className(
        "flex align-items-center gap-fluid-xs-s w-full px-fluid-s-m py-fluid-xs-s radius-1 f-size-fluid-1 f-weight-medium",
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
        icon = <Icon type="checkCircleOutline" className={iconClasses} />;
    } else if (isDanger) {
        icon = <Icon type="cancelOutline" className={iconClasses} />;
    } else if (isWarning) {
        icon = <Icon type="warningOutline" className={iconClasses} />;
    } else if (isInfo) {
        icon = <Icon type="infoOutline" className={iconClasses} />;
    }

    return (
        <div
            className="alert-item mb-fluid-s-m"
            data-visible={isVisible}
            data-extended={isExtended}
            ref={ref}
            style={{ maxHeight }}
        >
            <div className={classes} ref={ref}>
                {icon}
                {message}
                <button
                    className="button-close ml-auto line-height-1"
                    onClick={hideAlert}
                >
                    <Icon
                        type="close"
                        className="f-size-fluid-2 flex-shrink-0"
                    />
                </button>
            </div>
        </div>
    );
};

export default AlertListItem;
