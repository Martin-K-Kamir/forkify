import { createEntityAdapter, createSlice, nanoid } from "@reduxjs/toolkit";

export const alertAdapter = createEntityAdapter({
    sortComparer: (a, b) => a.date.localeCompare(b.date),
});

const initialState = alertAdapter.getInitialState();

const alertSlice = createSlice({
    name: "alert",
    initialState,
    reducers: {
        addAlert: {
            reducer: alertAdapter.addOne,
            prepare: action => {
                const date = new Date().toISOString();

                return {
                    payload: {
                        ...action,
                        id: action.message,
                        date,
                    },
                };
            },
        },
        removeAlert: alertAdapter.removeOne,
    },
});

export const { addAlert, removeAlert } = alertSlice.actions;
export default alertSlice.reducer;

export const {
    selectAll: selectAllAlerts,
    selectById: selectAlertById,
    selectIds: selectAlertIds,
} = alertAdapter.getSelectors(state => state.alert);
