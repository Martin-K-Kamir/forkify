import { api } from "../api/api";
import { createEntityAdapter } from "@reduxjs/toolkit";
import { dataSearchQueries } from "../../dataSearchQueries.js";
import { sub } from "date-fns";
import { addBookmark, removeBookmark } from "../bookmarks/bookmarksSlice.js";
import { addUserRecipe } from "../user/userSlice.js";
import { API_KEY } from "../../env.js";

const extendedApi = api.injectEndpoints({
    endpoints: builder => ({
        getRecipes: builder.query({
            query: recipesId => ({
                url: `?search=${recipesId}&key=${API_KEY}`,
                validateStatus: (response, result) => {
                    return (
                        response.status === 200 &&
                        result.data.recipes.length > 0
                    );
                },
            }),
            transformResponse: result => {
                let min = 1;
                let hour = 1;
                let day = 1;

                const recipes = result.data.recipes.map(recipe => {
                    if (!recipe?.date)
                        recipe.date = sub(new Date(), {
                            minutes: min++,
                            hours: hour++,
                            days: day++,
                        }).toISOString();
                    if (recipe.key) {
                        recipe.userId = recipe.key;
                        delete recipe.key;
                    }
                    return recipe;
                });

                const recipesAdapter = createEntityAdapter({
                    sortComparer: (a, b) => b.date.localeCompare(a.date),
                });

                return recipesAdapter.setAll(
                    recipesAdapter.getInitialState(),
                    recipes
                );
            },
            transformErrorResponse(result, meta, arg) {
                if (result.data.data.recipes.length === 0) {
                    return {message: `No recipes found for search "${arg}"`};
                }
            },
        }),
        getRecipe: builder.query({
            query: recipeId => `/${recipeId}`,
            transformResponse: result => {
                const recipe = result.data.recipe;

                if (!recipe?.isBookmarked) recipe.isBookmarked = false;
                if (recipe.key) {
                    recipe.userId = recipe.key;
                    delete recipe.key;
                }

                return recipe;
            },
        }),
        getSearchRecipes: builder.query({
            queryFn: async () => {
                try {
                    // Fake fetching data from an API
                    await new Promise(resolve => setTimeout(resolve, 200));
                    const {data} = dataSearchQueries;

                    return {data};
                } catch (error) {
                    return {error};
                }
            },
        }),
        updateBookmark: builder.mutation({
            queryFn: () => ({data: null}),
            async onQueryStarted(
                {id, isBookmarked},
                {dispatch, queryFulfilled, getState}
            ) {
                const patchResult = dispatch(
                    api.util.updateQueryData("getRecipe", id, draft => {
                        draft.isBookmarked = isBookmarked;
                        draft.bookmarkDate = new Date().toISOString();
                    })
                );

                const {data: recipe} = api.endpoints.getRecipe.select(id)(
                    getState()
                );

                if (isBookmarked) {
                    dispatch(addBookmark(recipe));
                } else {
                    dispatch(removeBookmark(recipe.id));
                }

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();

                    if (isBookmarked) {
                        dispatch(removeBookmark(recipe.id));
                    } else {
                        dispatch(addBookmark(recipe));
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
            async onQueryStarted(
                {recipe},
                {dispatch, queryFulfilled}
            ) {
                try {
                    const {data: recipe} = await queryFulfilled;
                    dispatch(addUserRecipe(recipe));
                } catch {
                }
            },
        }),
    }),
});

export const {
    useGetRecipesQuery,
    useLazyGetRecipesQuery,
    useGetRecipeQuery,
    useGetSearchRecipesQuery,
    useUpdateBookmarkMutation,
    useAddRecipeMutation,
} = extendedApi;

