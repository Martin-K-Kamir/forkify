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
import userReducer, {
    addUserRecipe,
    removeUserRecipe,
} from "../features/user/userSlice.js";

const localStorageListener = createListenerMiddleware();

localStorageListener.startListening({
    matcher: isAnyOf(addBookmark, removeBookmark, addUserRecipe, removeUserRecipe),
    effect: (action, { getState }) => {
        if (action.type === addBookmark.toString() || action.type === removeBookmark.toString()) {
            const bookmarks = getState().bookmarks;
            localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        }

        if (action.type === addUserRecipe.toString() || action.type === removeUserRecipe.toString()) {
            const user = getState().user.userRecipes;
            localStorage.setItem("userRecipes", JSON.stringify(user));
        }
    },
});

export const store = configureStore({
    reducer: {
        alert: alertReducer,
        bookmarks: bookmarksReducer,
        user: userReducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
            .prepend(localStorageListener.middleware)
            .concat(api.middleware),
});

setupListeners(store.dispatch);
