import SearchQueriesButtons from "./SearchQueriesButtons.jsx";
import SearchRecipesForm from "./SearchRecipesForm.jsx";
import React from "react";

const SearchRecipesPage = () => {
    return (
        <div className="flex flex-direction-column align-items-center gap-l gap-xl//above-sm mt-fluid-2xl-4xl">
            <h1 className="block f-family-secondary f-size-5 f-size-6//above-sm f-weight-medium line-height-1">
                Forkify
            </h1>

            <SearchRecipesForm size="lg" />

            <SearchQueriesButtons />
        </div>
    );
};

export default SearchRecipesPage;
