import { useParams } from "react-router-dom";
import { useGetRecipesQuery } from "./recipiesSlice.js";
import RecipesList from "./RecipesList.jsx";
import Icon from "../../components/Icon.jsx";
import { capitalizeWords } from "../../utilities.js";

const RecipesPage = () => {
    const { recipesId } = useParams();
    const { data, isLoading, isError, isSuccess, error } =
        useGetRecipesQuery(recipesId);

    if (isLoading) {
        return (
            <div className="flex justify-content-center">
                <Icon
                    type="progressActivity"
                    className="animation-spin f-size-5"
                />
            </div>
        );
    } else if (isError) {
        return (
            <div className="text-center f-size-1 f-weight-medium text-red-100 flex align-items-center justify-content-center flex-direction-column gap-2xs">
                <Icon type="warning" className="f-size-3" />
                {error?.message || "Something went wrong! Please try again."}
            </div>
        );
    } else if (isSuccess) {
        return (
            <div>
                <header>
                    <div className="text-center text-left//above-sm">
                        <h1 className="f-size-fluid-2 f-weight-medium">
                            Search results for {capitalizeWords(recipesId)}
                        </h1>
                        <p className="f-size-fluid-1 mt-3xs text-gray-600 text-zinc-200//dark">
                            We've found {data.ids.length} recipes for you.
                        </p>
                    </div>
                </header>

                <div className="mt-m">
                    <RecipesList recipes={Object.values(data.entities)} />
                </div>
            </div>
        );
    }

    return null;
};

export default RecipesPage;
