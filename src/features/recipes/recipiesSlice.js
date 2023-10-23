import { api } from "../api/api";
import { createEntityAdapter } from "@reduxjs/toolkit";
import { dataSearchQueries } from "../../dataSearchQueries.js";
import { sub } from "date-fns";

export const recipesAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const extendedApi = api.injectEndpoints({
    endpoints: builder => ({
        getRecipes: builder.query({
            query: recipesId => ({
                url: `?search=${recipesId}`,
                validateStatus: (response, result) => {
                    return (
                        response.status === 200 &&
                        result.data.recipes.length > 0
                    );
                },
            }),
            transformResponse: result => {
                console.log({result});
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
                    return {message: `No recipes found for search "${arg}"`};
                }
            },
        }),
        getRecipe: builder.query({
            query: recipeId => `/${recipeId}`,
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
    }),
});

export const {
    useGetRecipesQuery,
    useLazyGetRecipesQuery,
    useGetRecipeQuery,
    useGetSearchRecipesQuery,
} = extendedApi;
export const useGetRecipesState =
    extendedApi.endpoints.getRecipes.useQueryState;
