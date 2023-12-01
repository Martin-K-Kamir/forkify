import { useParams } from "react-router-dom";
import { useGetRecipeQuery } from "./recipiesSlice.js";
import Icon from "../../components/Icon.jsx";
import SingleRecipe from "./SingleRecipe.jsx";
import { capitalizeWords } from "../../utilities.js";
import useDocumentTitle from "../../hooks/useDocumentTitle.js";

const SingleRecipePage = () => {
    const { recipeId } = useParams();
    const {
        data: recipe,
        isLoading,
        isError,
        isSuccess,
        error,
    } = useGetRecipeQuery(recipeId);

    useDocumentTitle(`${capitalizeWords(recipe?.title)} | Forkify`, isSuccess);

    if (isLoading) {
        return (
            <div className="flex abc justify-content-center">
                <Icon
                    type="progressActivity"
                    className="animation-spin f-size-5"
                />
            </div>
        );
    } else if (isError) {
        return (
            <div className="text-center f-size-1 f-weight-medium text-red-100 flex align-items-center justify-content-center flex-direction-column gap-3xs">
                <Icon type="warning" className="f-size-3" fill />
                {error?.message || "Recipe not found"}
            </div>
        );
    } else if (isSuccess) {
        return <SingleRecipe recipe={recipe} />;
    }

    return null;
};

export default SingleRecipePage;
