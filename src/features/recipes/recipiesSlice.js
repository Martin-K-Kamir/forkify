import { api } from "../api/api";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
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
            // queryFn: async (recipesId, api, extraOptions, baseQuery) => {
            //     const response = await baseQuery(`?search=${recipesId}`);
            //
            //     console.log(response.data.data.recipes);
            //
            //     const preloadedRecipes = [];
            //
            //     const preloadPromises = response.data.data.recipes.map(
            //         async recipe => {
            //             return new Promise(async resolve => {
            //                 const img = new Image();
            //                 img.src = recipe.image_url;
            //
            //                 // Handle image load and error events
            //                 img.onload = () => {
            //                     preloadedRecipes.push(recipe);
            //                     resolve();
            //                 };
            //
            //                 img.onerror = () => {
            //                     // Handle the error, e.g., by logging it
            //                     console.error(
            //                         `Failed to preload image: ${recipe.image_url}`
            //                     );
            //                     resolve(); // Resolve the promise to continue preloading other images
            //                 };
            //             });
            //         }
            //     );
            //
            //     await Promise.all(preloadPromises);
            //
            //     let min = 1;
            //     let hour = 1;
            //     let day = 1;
            //
            //     const recipes = preloadedRecipes.map(post => {
            //         if (!post?.date)
            //             post.date = sub(new Date(), {
            //                 minutes: min++,
            //                 hours: hour++,
            //                 days: day++,
            //             }).toISOString();
            //         return post;
            //     });
            //
            //     return {
            //         data: recipesAdapter.setAll(
            //             recipesAdapter.getInitialState(),
            //             recipes
            //         ),
            //     };
            // },
            transformResponse: result => {
                console.log({ result });
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
    useGetSearchRecipesQuery,
} = extendedApi;
export const useGetRecipesState =
    extendedApi.endpoints.getRecipes.useQueryState;
