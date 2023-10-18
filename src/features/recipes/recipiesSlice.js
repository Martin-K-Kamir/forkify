import { api } from "../api/api";
import { createEntityAdapter } from "@reduxjs/toolkit";
import { dataSearchQueries } from "../../dataSearchQueries.js";

export const recipesAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = recipesAdapter.getInitialState();

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
