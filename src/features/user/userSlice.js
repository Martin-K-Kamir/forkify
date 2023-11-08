import {
    createEntityAdapter,
    createSelector,
    createSlice,
} from "@reduxjs/toolkit";
import { api } from "../api/api.js";
import { API_KEY } from "../../env.js";

const extendedApi = api.injectEndpoints({
    endpoints: builder => ({
        updateBookmark: builder.mutation({
            queryFn: () => ({ data: null }),
            async onQueryStarted(
                { id, isBookmarked },
                { dispatch, queryFulfilled, getState }
            ) {
                const patchResult = dispatch(
                    api.util.updateQueryData("getRecipe", id, draft => {
                        draft.isBookmarked = isBookmarked;
                        draft.bookmarkDate = new Date().toISOString();
                    })
                );

                const { data: recipe } = api.endpoints.getRecipe.select(id)(
                    getState()
                );

                if (isBookmarked) {
                    dispatch(addUserBookmark(recipe));
                } else {
                    dispatch(removeUserBookmark(recipe.id));
                }

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();

                    if (isBookmarked) {
                        dispatch(removeUserBookmark(recipe.id));
                    } else {
                        dispatch(addUserBookmark(recipe));
                    }
                }
            },
        }),
        addRecipe: builder.mutation({
            query: recipe => ({
                url: `/?key=${API_KEY}`,
                method: "POST",
                body: recipe,
            }),
            transformResponse: result => {
                const recipe = result.data.recipe;

                if (recipe.key) {
                    recipe.userId = recipe.key;
                    delete recipe.key;
                }
                if (!recipe?.date) recipe.date = new Date().toISOString();

                return recipe;
            },
            transformErrorResponse: result => {
                if ([401].includes(result.status)) {
                    return {
                        message:
                            "Oops! Something went wrong on our end. Please try again later.",
                    };
                }

                if ([500, 501, 502, 503, 504, 505].includes(result.status)) {
                    return {
                        message:
                            "Our server needs a coffee break. Try again later.",
                    };
                }

                return result.data;
            },
            async onQueryStarted({ recipe }, { dispatch, queryFulfilled }) {
                try {
                    const { data: recipe } = await queryFulfilled;
                    dispatch(addUserRecipe(recipe));
                } catch {}
            },
        }),
    }),
});

export const { useUpdateBookmarkMutation, useAddRecipeMutation } = extendedApi;

const userRecipesAdapter = createEntityAdapter({
    sortComparer: (a, b) => {
        if (a.bookmarkDate) {
            return b.bookmarkDate.localeCompare(a.bookmarkDate);
        }

        return b.date.localeCompare(a.date);
    },
});

const userRecipes = localStorage.getItem("userRecipes");
const userBookmarks = localStorage.getItem("userBookmarks");

const initialState = {
    userRecipes: userRecipes
        ? JSON.parse(userRecipes)
        : userRecipesAdapter.getInitialState(),
    userBookmarks: userBookmarks
        ? JSON.parse(userBookmarks)
        : userRecipesAdapter.getInitialState(),
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUserRecipe: (state, action) => {
            userRecipesAdapter.addOne(state.userRecipes, action.payload);
        },
        removeUserRecipe: (state, action) => {
            userRecipesAdapter.removeOne(state.userRecipes, action.payload);
        },
        addUserBookmark: (state, action) => {
            userRecipesAdapter.addOne(state.userBookmarks, action.payload);
        },
        removeUserBookmark: (state, action) => {
            userRecipesAdapter.removeOne(state.userBookmarks, action.payload);
        },
    },
});

export const {
    addUserBookmark,
    addUserRecipe,
    removeUserBookmark,
    removeUserRecipe,
} = userSlice.actions;
export default userSlice.reducer;

export const {
    selectAll: selectAllUserRecipes,
    selectById: selectUserRecipeById,
    selectIds: selectUserRecipeIds,
    selectTotal: selectTotalUserRecipes,
} = userRecipesAdapter.getSelectors(state => state.user.userRecipes);

export const {
    selectAll: selectAllUserBookmarks,
    selectById: selectUserBookmarkById,
    selectIds: selectUserBookmarkIds,
    selectTotal: selectTotalUserBookmarks,
} = userRecipesAdapter.getSelectors(state => state.user.userBookmarks);

export const selectUserAllRecipes = createSelector(
    selectAllUserRecipes,
    selectAllUserBookmarks,
    (userRecipes, userBookmarks) => {
        return [...userRecipes, ...userBookmarks]
            .map(recipe => {
                if (recipe.isBookmarked) {
                    recipe.bookmarkDate = recipe.date;
                }
            })
            .sort((a, b) => b.date.localeCompare(a.date));
    }
);
