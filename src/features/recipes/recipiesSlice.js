import { api } from "../api/api";
import { createEntityAdapter } from "@reduxjs/toolkit";

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
                    return response.status === 200 && result.data.recipes.length > 0;
                }
            }),
            transformErrorResponse(result, meta, arg) {
                if (result.data.data.recipes.length === 0) {
                    return { message: `No recipes found for your search ${arg}` };
                }
            },

        })
    }),
});

export const { useGetRecipesQuery, useLazyGetRecipesQuery } = extendedApi;