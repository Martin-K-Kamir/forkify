import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "../features/api/api";
import alertReducer from "../features/alert/alertSlice";
export const store = configureStore({
    reducer: {
        alert: alertReducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);