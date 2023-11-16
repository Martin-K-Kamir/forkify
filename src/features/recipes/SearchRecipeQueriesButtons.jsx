import { useGetSearchQueriesQuery } from "./recipiesSlice.js";
import { Link } from "react-router-dom";
import React from "react";
import { capitalizeWords } from "../../utilities.js";
import Button from "../../components/Button.jsx";

let SearchRecipeQueriesButtons = () => {
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
                color="bg-zinc-800 text-zinc-200"
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
        <div className="max-w-m flex flex-wrap justify-content-center gap-s">
            {renderedRecipes}
        </div>
    );
};

SearchRecipeQueriesButtons = React.memo(SearchRecipeQueriesButtons);

export default SearchRecipeQueriesButtons;
