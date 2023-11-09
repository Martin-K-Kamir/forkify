import { api } from "../api/api";
import { createEntityAdapter } from "@reduxjs/toolkit";
import { dataSearchQueries } from "../../dataSearchQueries.js";
import { sub } from "date-fns";
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
                    if (!recipe?.createdAt)
                        recipe.createdAt = sub(new Date(), {
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
                    sortComparer: (a, b) =>
                        b.createdAt.localeCompare(a.createdAt),
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
                if (!recipe?.createdAt)
                    recipe.createdAt = new Date().toISOString();
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
                    const { data } = dataSearchQueries;

                    return { data };
                } catch (error) {
                    return { error };
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
} = extendedApi;
