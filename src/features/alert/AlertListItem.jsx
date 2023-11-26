import { removeAlert, selectAlertById } from "./alertSlice.js";
import { useDispatch, useSelector } from "react-redux";
import className from "classnames";
import Icon from "../../components/Icon.jsx";
import React, { useEffect, useRef, useState } from "react";
import IconButton from "../../components/IconButton.jsx";

const AlertListItem = ({ alertId }) => {
    const dispatch = useDispatch();

    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const [maxHeight, setMaxHeight] = useState(0);
    const ref = useRef(null);

    const alert = useSelector(state => selectAlertById(state, alertId));
    const { isSuccess, isDanger, isWarning, isInfo, message, timeout } = alert;

    useEffect(() => {
        setMaxHeight(ref.current.scrollHeight);

        setTimeout(() => {
            setIsVisible(true);
        }, 100);

        setTimeout(hideAlert, timeout || 3000);
    }, []);

    const hideAlert = () => {
        setIsVisible(false);
        setIsExpanded(false);
        setMaxHeight(0);

        setTimeout(() => {
            dispatch(removeAlert(alertId));
        }, 500);
    };

    const classes = className(
        "flex align-items-center gap-fluid-xs-s w-full px-fluid-s-m py-fluid-xs-s radius-1 f-size-fluid-1 f-weight-medium",
        {
            "text-green-900 bg-green-200 bg-green-050//dark": isSuccess,
            "text-red-900 bg-red-200 bg-red-050//dark": isDanger,
            "text-yellow-700 bg-yellow-200 bg-yellow-100//dark": isWarning,
            "text-blue-900 bg-blue-200 bg-blue-050//dark":
                !isSuccess && !isDanger && !isWarning,
        }
    );

    const iconClasses = className("f-size-fluid-2 flex-shrink-0");

    let icon;
    if (isSuccess) {
        icon = <Icon type="checkCircle" className={iconClasses} fill={true} />;
    } else if (isDanger) {
        icon = <Icon type="cancel" className={iconClasses} fill={true} />;
    } else if (isWarning) {
        icon = <Icon type="warning" className={iconClasses} fill={true} />;
    } else {
        icon = <Icon type="info" className={iconClasses} fill={true} />;
    }

    return (
        <div
            className="alert-item mb-fluid-s-m transition-zoom transition-expand"
            data-zoom={isVisible}
            data-expand={isExpanded}
            ref={ref}
            style={{ maxHeight }}
        >
            <div className={classes} ref={ref}>
                {icon}
                {message}
                <IconButton
                    variant="text"
                    color="f-size-inherit"
                    className="ml-auto"
                    onClick={hideAlert}
                    srOnly="Close alert"
                    hover="absolute"
                >
                    <Icon
                        type="close"
                        className="f-size-fluid-2 flex-shrink-0"
                    />
                </IconButton>
            </div>
        </div>
    );
};

export default AlertListItem;
