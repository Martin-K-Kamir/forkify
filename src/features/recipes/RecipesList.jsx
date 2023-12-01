import { useParams } from "react-router-dom";
import RecipesListItem from "./RecipesListItem.jsx";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import Icon from "../../components/Icon.jsx";
import Button from "../../components/Button.jsx";
import { ABOVE_MD, BELOW_MD, BELOW_SM } from "../../app/config.js";

const RecipesList = ({ recipes }) => {
    const { recipesId } = useParams();
    const isAboveMd = useMediaQuery(ABOVE_MD);
    const isBelowSm = useMediaQuery(BELOW_SM);
    const isBelowMd = useMediaQuery(BELOW_MD);

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
        window.scrollTo(0, 0);
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
                <p className="text-center f-size-1 f-weight-medium text-red-600 text-red-100//dark flex align-items-center justify-content-center flex-direction-column gap-3xs">
                    <Icon type="warning" fill className="f-size-3" />
                    No recipes found.
                </p>
            )}

            <div className="flex justify-content-center align-items-center gap-s mt-l">
                {!isLimitReached && !isRecipesListEmpty && renderedRecipes.length > 1 && (
                    <Button
                        bold
                        fontSize="sm"
                        color="secondary"
                        onClick={handleClick}
                    >
                        More Recipes
                    </Button>
                )}

                {isLimitReached &&
                    renderedRecipes.length > 6 &&
                    !isRecipesListEmpty && (
                        <Button
                            bold
                            fontSize="sm"
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
