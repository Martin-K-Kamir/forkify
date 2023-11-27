import { useParams } from "react-router-dom";
import { useGetRecipeQuery } from "./recipiesSlice.js";
import Icon from "../../components/Icon.jsx";
import SingleRecipe from "./SingleRecipe.jsx";
import { useEffect } from "react";
import { capitalizeWords } from "../../utilities.js";

const SingleRecipePage = () => {
    const { recipeId } = useParams();
    const {
        data: recipe,
        isLoading,
        isError,
        isSuccess,
        error,
    } = useGetRecipeQuery(recipeId);

    useEffect(() => {
        const originalTitle = document.title;

        if (isSuccess) {
            document.title = `${capitalizeWords(recipe.title)} | Forkify`;
        }

        return () => {
            document.title = originalTitle;
        };
    }, [isSuccess]);

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
            <div className="text-center f-size-1 f-weight-medium text-red-100 flex align-items-center justify-content-center flex-direction-column gap-2xs">
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
