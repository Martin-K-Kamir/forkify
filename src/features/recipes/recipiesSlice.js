import { api } from "../api/api";
import { createEntityAdapter } from "@reduxjs/toolkit";
import { dataSearchQueries } from "../../dataSearchQueries.js";
import { sub } from "date-fns";
import { API_KEY } from "../../env.js";
import { addAlert, removeAlert } from "../alert/alertSlice.js";
import { ALERT_TIMEOUT_LONG } from "../../app/config.js";

const handleLongRunningQuery = async (
    queryFulfilled,
    dispatch,
    alertTimeout = ALERT_TIMEOUT_LONG,
    alertDelay = ALERT_TIMEOUT_LONG
) => {
    const message = "The request is taking longer than expected.";

    let timeout = setTimeout(() => {
        dispatch(
            addAlert({
                message,
                isWarning: true,
                timeout: alertTimeout,
            })
        );
    }, alertDelay);

    try {
        await queryFulfilled;
    } catch {}
    clearTimeout(timeout);
    dispatch(removeAlert(message));
};

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
            providesTags: (result, error) => {
                if (error || !result) return [{ type: "Recipe", id: "LIST" }];
                return [
                    ...result.ids.map(id => ({ type: "Recipe", id })),
                    { type: "Recipe", id: "LIST" },
                ];
            },
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
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                await handleLongRunningQuery(queryFulfilled, dispatch);
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
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                await handleLongRunningQuery(queryFulfilled, dispatch);
            },
        }),
        getSearchQueries: builder.query({
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
    useGetSearchQueriesQuery,
} = extendedApi;
