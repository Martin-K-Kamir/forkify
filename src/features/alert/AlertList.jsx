import "./alert.css";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { selectAlertIds } from "./alertSlice.js";
import AlertListItem from "./AlertListItem.jsx";

const AlertList = () => {
    const alertIds = useSelector(selectAlertIds);

    const renderedAlerts = alertIds.map(alertId => (
        <AlertListItem key={alertId} alertId={alertId} />
    ));

    return createPortal(
        <div className="alert-list w-full">
            <div className="wrapper grid max-w-m">{renderedAlerts}</div>
        </div>,
        document.getElementById("alert")
    );
};

export default AlertList;
