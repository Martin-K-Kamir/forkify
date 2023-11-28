import {
    configureStore,
    createListenerMiddleware,
    isAnyOf,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "../features/api/api";
import alertReducer from "../features/alert/alertSlice";
import userReducer, {
    addUserBookmark,
    addUserRecipe,
    removeUserBookmark,
    removeUserRecipe,
} from "../features/user/userSlice.js";

const localStorageListener = createListenerMiddleware();

localStorageListener.startListening({
    matcher: isAnyOf(
        addUserBookmark,
        removeUserBookmark,
        addUserRecipe,
        removeUserRecipe
    ),
    effect: (action, { getState }) => {
        if (
            action.type === addUserBookmark.toString() ||
            action.type === removeUserBookmark.toString()
        ) {
            const bookmarks = getState().user.userBookmarks;
            localStorage.setItem("userBookmarks", JSON.stringify(bookmarks));
        }

        if (
            action.type === addUserRecipe.toString() ||
            action.type === removeUserRecipe.toString()
        ) {
            const user = getState().user.userRecipes;
            localStorage.setItem("userRecipes", JSON.stringify(user));
        }
    },
});

export const store = configureStore({
    reducer: {
        alert: alertReducer,
        user: userReducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
            .prepend(localStorageListener.middleware)
            .concat(api.middleware),
    devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);
