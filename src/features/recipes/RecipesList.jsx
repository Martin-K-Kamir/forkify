import "./RecipesList.css";
import { useParams } from "react-router-dom";
import RecipesListItem from "./RecipesListItem.jsx";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";

const RecipesList = ({ recipesIds }) => {
    const { recipesId } = useParams();
    const isBelowSm = useMediaQuery("(width < 30em)");
    const isBelowMd = useMediaQuery("(width < 48em)");
    const isAboveMd = useMediaQuery("(width >= 48em)");

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

    const isLimitReached = limit >= recipesIds?.ids?.length;

    const renderedRecipes = recipesIds.slice(0, limit).map(recipeId => {
        return <RecipesListItem key={recipeId} recipeId={recipeId} />;
    });

    const handleClick = () => {
        setLimit(prevLimit => prevLimit + originalLimit);
    };

    return (
        <div>
            <ul className="recipes-list gap-l" role="list">
                {renderedRecipes}
            </ul>
            <div className="flex justify-content-center align-items-center gap-s mt-l">
                {!isLimitReached && (
                    <button
                        className="bg-zinc-800 f-weight-medium f-size-1 f-size--1//above-sm radius-1 line-height-1 px-m py-xs"
                        onClick={handleClick}
                    >
                        More Recipes
                    </button>
                )}
            </div>
        </div>
    );
};
export default RecipesList;
