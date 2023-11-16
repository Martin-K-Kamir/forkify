import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://forkify-api.herokuapp.com/api/v2/recipes",
        fetchFn: async (...args) => {
            // console.log(...args);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return fetch(...args);
        },
        // prepareHeaders(headers) {
        // headers.set("key", "e403b26e-b88b-46a1-949f-ba1a4e1cde2a");
        // headers.set("key", "c62986c1-429b-4175-98ba-d2d6813fb6bf");
        // return headers;
        // },
    }),
    tagTypes: ["Recipe"],
    endpoints: () => ({}),
});
