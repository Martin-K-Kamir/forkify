import { useGetSearchRecipesQuery } from "./recipiesSlice.js";
import { Link } from "react-router-dom";
import React from "react";

let SearchRecipesButtons = () => {
    const { data } = useGetSearchRecipesQuery();

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
            <Link
                to={`/recipes/${recipe}`}
                className="bg-zinc-800 text-zinc-200 px-m py-xs f-size--1 line-height-1 text-no-decoration radius-pill"
                key={recipe}
            >
                {recipe}
            </Link>
        );
    });

    return (
        <div className="max-w-m flex flex-wrap justify-content-center gap-s">
            {renderedRecipes}
        </div>
    );
};

SearchRecipesButtons = React.memo(SearchRecipesButtons);

export default SearchRecipesButtons;
