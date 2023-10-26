import {
    createEntityAdapter,
    createSelector,
    createSlice,
} from "@reduxjs/toolkit";

const bookmarksAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.bookmarkDate.localeCompare(a.bookmarkDate),
});

const bookmarks = localStorage.getItem("bookmarks");

const initialState = bookmarks
    ? JSON.parse(bookmarks)
    : bookmarksAdapter.getInitialState();

const bookmarksSlice = createSlice({
    name: "bookmarks",
    initialState,
    reducers: {
        addBookmark: {
            reducer: bookmarksAdapter.addOne,
            prepare: action => {
                const bookmarkDate = new Date().toISOString();

                return {
                    payload: {
                        ...action,
                        bookmarkDate,
                    },
                };
            },
        },
        removeBookmark: bookmarksAdapter.removeOne,
    },
});

export const { addBookmark, removeBookmark } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;

export const {
    selectAll: selectAllBookmarks,
    selectById: selectBookmarkById,
    selectIds: selectBookmarkIds,
} = bookmarksAdapter.getSelectors(state => state.bookmarks);
