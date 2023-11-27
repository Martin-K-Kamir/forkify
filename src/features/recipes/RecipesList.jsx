import { useParams } from "react-router-dom";
import RecipesListItem from "./RecipesListItem.jsx";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import Icon from "../../components/Icon.jsx";
import Button from "../../components/Button.jsx";

const RecipesList = ({ recipes }) => {
    const { recipesId } = useParams();
    const isBelowSm = useMediaQuery("(width < 30em)");
    const isBelowMd = useMediaQuery("(width < 48em)");
    const isAboveMd = useMediaQuery("(width >= 48em)");
    const isAboveSm = useMediaQuery("(width >= 30em)");

    const [limit, setLimit] = useState(0);
    const [originalLimit, setOriginalLimit] = useState(0);

    useEffect(() => {
        if (isBelowSm) {
            setLimit(3);
            setOriginalLimit(3);
        } else if (isBelowMd) {
            setLimit(4);
            setOriginalLimit(4);
        } else if (isAboveMd) {
            setLimit(6);
            setOriginalLimit(6);
        }
    }, [recipesId]);

    const renderedRecipes = recipes.slice(0, limit).map(recipe => {
        return <RecipesListItem key={recipe.id} {...recipe} />;
    });

    const isRecipesListEmpty = recipes.length === 0;

    const isLimitReached = limit >= recipes?.length;

    const handleReset = () => {
        setLimit(originalLimit);
    };
    const handleClick = () => {
        setLimit(prevLimit => prevLimit + originalLimit);
    };

    return (
        <div>
            {!isRecipesListEmpty && (
                <ul
                    id="recipes-list"
                    className="grid cols-fill-m gap-l"
                    role="list"
                >
                    {renderedRecipes}
                </ul>
            )}

            {isRecipesListEmpty && (
                <p className="text-center f-size-1 f-weight-medium text-red-600 text-red-100//dark flex align-items-center justify-content-center flex-direction-column gap-2xs">
                    <Icon type="warning" fill className="f-size-3" />
                    No recipes found. Please try again.
                </p>
            )}

            <div className="flex justify-content-center align-items-center gap-s mt-l">
                {!isLimitReached && !isRecipesListEmpty && (
                    <Button
                        bold
                        fontSize={isAboveSm ? "sm" : "md"}
                        color="secondary"
                        onClick={handleClick}
                    >
                        More Recipes
                    </Button>
                )}

                {isLimitReached &&
                    recipes.length > 6 &&
                    !isRecipesListEmpty && (
                        <Button
                            bold
                            fontSize={isAboveSm ? "sm" : "md"}
                            color="success"
                            onClick={handleReset}
                        >
                            Back to Top
                        </Button>
                    )}
            </div>
        </div>
    );
};
export default RecipesList;
