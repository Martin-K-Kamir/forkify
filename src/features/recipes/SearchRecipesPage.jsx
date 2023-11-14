import SearchRecipeQueriesButtons from "./SearchRecipeQueriesButtons.jsx";
import SearchRecipes from "./SearchRecipes.jsx";

const SearchRecipesPage = () => {

    return (
        <div className="flex flex-direction-column align-items-center gap-l gap-xl//above-sm mt-fluid-l-4xl">
            <h1 className="block f-family-secondary f-size-5 f-size-6//above-sm f-weight-medium line-height-1">
                Forkify
            </h1>

            <SearchRecipes />

            <SearchRecipeQueriesButtons />
        </div>
    );
};

export default SearchRecipesPage;
