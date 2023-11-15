import SearchRecipeQueriesButtons from "./SearchRecipeQueriesButtons.jsx";
import SearchRecipes from "./SearchRecipes.jsx";
import Button from "../../components/Button.jsx";
import Icon from "../../components/Icon.jsx";
import React from "react";
import { useMediaQuery } from "@uidotdev/usehooks";

const SearchRecipesPage = () => {
    const isAboveLg = useMediaQuery("(width < 32em)");

    return (
        <div className="flex flex-direction-column align-items-center gap-l gap-xl//above-sm mt-fluid-l-4xl">
            <h1 className="block f-family-secondary f-size-5 f-size-6//above-sm f-weight-medium line-height-1">
                Forkify
            </h1>

            <SearchRecipes />

            <SearchRecipeQueriesButtons />

            <Button className="mt-l">Search</Button>
        </div>
    );
};

export default SearchRecipesPage;
