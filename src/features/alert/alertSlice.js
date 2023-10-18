import { createEntityAdapter, createSlice, nanoid } from "@reduxjs/toolkit";

export const alertAdapter = createEntityAdapter({
    sortComparer: (a, b) => a.date.localeCompare(b.date),
});

const initialState = alertAdapter.getInitialState();

const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        showAlert: {
            reducer: alertAdapter.addOne,
            prepare: (action) => {
                const date = new Date().toISOString()

                return {
                    payload: {
                        ...action,
                        id: action.message,
                        date,
                    }
                }
            },
        },
    }
})

export const {showAlert} = alertSlice.actions
export default alertSlice.reducer

export const {
    selectAll: selectAllAlerts,
    selectById: selectAlertById,
    selectIds: selectAlertIds,
} = alertAdapter.getSelectors(state => state.alert)