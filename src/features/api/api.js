import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://forkify-api.herokuapp.com/api/v2/recipes",
        // fetchFn: async (...args) => {
        //     console.log(...args);
        //     await new Promise(resolve => setTimeout(resolve, 11_000));
        //     return fetch(...args);
        // },
    }),
    tagTypes: ["Recipe"],
    endpoints: () => ({}),
});
