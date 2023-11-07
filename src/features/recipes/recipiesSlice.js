import { api } from "../api/api";
import { createEntityAdapter } from "@reduxjs/toolkit";
import { dataSearchQueries } from "../../dataSearchQueries.js";
import { sub } from "date-fns";
import Fraction from "fraction.js";
import { addBookmark, removeBookmark } from "../bookmarks/bookmarksSlice.js";
import { API_KEY } from "../../env.js";

export const recipesAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date),
});

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

                const recipes = result.data.recipes.map(post => {
                    if (!post?.date)
                        post.date = sub(new Date(), {
                            minutes: min++,
                            hours: hour++,
                            days: day++,
                        }).toISOString();
                    return post;
                });

                return recipesAdapter.setAll(
                    recipesAdapter.getInitialState(),
                    recipes
                );
            },
            transformErrorResponse(result, meta, arg) {
                if (result.data.data.recipes.length === 0) {
                    return { message: `No recipes found for search "${arg}"` };
                }
            },
        }),
        getRecipe: builder.query({
            query: recipeId => `/${recipeId}`,
            transformResponse: result => {
                const recipe = result.data.recipe;

                if (!recipe?.isBookmarked) recipe.isBookmarked = false;

                return recipe;
            },
        }),
        getSearchRecipes: builder.query({
            queryFn: async () => {
                try {
                    // Fake fetching data from an API
                    await new Promise(resolve => setTimeout(resolve, 200));
                    const { data } = dataSearchQueries;

                    return { data };
                } catch (error) {
                    return { error };
                }
            },
        }),
        updateBookmark: builder.mutation({
            queryFn: () => ({ data: null }),
            async onQueryStarted(
                { id, isBookmarked },
                { dispatch, queryFulfilled, getState }
            ) {
                const patchResult = dispatch(
                    api.util.updateQueryData("getRecipe", id, draft => {
                        draft.isBookmarked = isBookmarked;
                    })
                );

                const { data: recipe } = api.endpoints.getRecipe.select(id)(
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

                if (!recipe?.isBookmarked) recipe.isBookmarked = false;

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
