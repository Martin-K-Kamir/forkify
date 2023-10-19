import { useGetRecipesState } from "./recipiesSlice.js";
import { useParams } from "react-router-dom";

const RecipesListItem = ({ recipeId }) => {
    const { recipesId } = useParams();

    const recipe = useGetRecipesState(recipesId, {
        selectFromResult: ({ data }) => data.entities[recipeId],
    });

    console.log(recipe);

    return (
        <div className="mb-fluid-m-l">
            <img src={recipe.image_url} alt={recipe.title} />
            <h3>{recipe.title}</h3>
            <p>{recipe.publisher}</p>
        </div>
    );
};

export default RecipesListItem;
