import { useGetRecipesState } from "./recipiesSlice.js";
import { useParams } from "react-router-dom";

const RecipesListItem = ({recipeId}) => {
    const {recipesId} = useParams();

    const recipe = useGetRecipesState(recipesId, {
        selectFromResult: ({data}) => data.entities[recipeId],
    });

    console.log(recipe);

    return (
        <div className="recipes-list__item bg-zinc-800 radius-1 overflow-hidden">
            <img className="w-full aspect-ratio-16x9 object-cover" src={recipe.image_url} alt={recipe.title}/>
            <div className="p-s">
                <h3 className="f-size-1">{recipe.title}</h3>
                <p className="f-size--1 mt-2xs">by {recipe.publisher}</p>
            </div>
        </div>
    );
};

export default RecipesListItem;
