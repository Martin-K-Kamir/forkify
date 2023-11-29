import { addAlert, removeAlert } from "../alert/alertSlice.js";
import { ALERT_TIMEOUT_LONG } from "../../app/config.js";

export const apiLongRunningRequest = async (
    queryFulfilled,
    dispatch,
    alertTimeout = ALERT_TIMEOUT_LONG,
    alertDelay = ALERT_TIMEOUT_LONG
) => {
    const message = "The request is taking longer than expected.";

    let timeout = setTimeout(() => {
        dispatch(
            addAlert({
                message,
                isWarning: true,
                timeout: alertTimeout,
            })
        );
    }, alertDelay);

    try {
        await queryFulfilled;
    } catch {}
    clearTimeout(timeout);
    dispatch(removeAlert(message));
};
