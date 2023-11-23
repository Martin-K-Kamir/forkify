import { useGetSearchQueriesQuery } from "./recipiesSlice.js";
import React from "react";
import { capitalizeWords } from "../../utilities.js";
import Button from "../../components/Button.jsx";

let SearchQueriesButtons = () => {
    const { data } = useGetSearchQueriesQuery();

    const randomizeArray = (data, count = 8) => {
        if (!data || data.length === 0) return [];

        const shuffledData = [...data];
        for (let i = shuffledData.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledData[i], shuffledData[j]] = [
                shuffledData[j],
                shuffledData[i],
            ];
        }

        return shuffledData.slice(0, count);
    };

    const renderedRecipes = randomizeArray(data)?.map(recipe => {
        return (
            <Button
                to={`/search/${recipe}`}
                color="bg-gray-300 text-gray-600 bg-zinc-800//dark text-zinc-200//dark"
                fontSize="sm"
                rounded="pill"
                className="text-no-decoration"
                key={recipe}
            >
                {capitalizeWords(recipe)}
            </Button>
        );
    });

    return (
        <div className="max-w-m flex flex-wrap justify-content-center gap-xs gap-s//above-sm">
            {renderedRecipes}
        </div>
    );
};

SearchQueriesButtons = React.memo(SearchQueriesButtons);

export default SearchQueriesButtons;
