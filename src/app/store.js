import {
    configureStore,
    createListenerMiddleware,
    isAnyOf,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "../features/api/api";
import alertReducer from "../features/alert/alertSlice";
import bookmarksReducer, {
    addBookmark,
    removeBookmark,
} from "../features/bookmarks/bookmarksSlice";

const localStorageListener = createListenerMiddleware();

localStorageListener.startListening({
    matcher: isAnyOf(addBookmark, removeBookmark),
    effect: (action, { getState }) => {
        const bookmarks = getState().bookmarks;
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    },
});

export const store = configureStore({
    reducer: {
        alert: alertReducer,
        bookmarks: bookmarksReducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
            .prepend(localStorageListener.middleware)
            .concat(api.middleware),
});

setupListeners(store.dispatch);
