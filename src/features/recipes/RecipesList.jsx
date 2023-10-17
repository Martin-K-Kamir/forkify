import { useParams } from "react-router-dom";
import { useGetRecipesQuery } from "./recipiesSlice.js";

const RecipesList = () => {
    const {recipesId} = useParams();
    const {data, isLoading, isError, error} = useGetRecipesQuery(recipesId);

    return (
        <div>
            <h1>RecipesList</h1>
        </div>
    )
}

export default RecipesList