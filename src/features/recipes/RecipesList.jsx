import "./RecipesList.css";
import { useParams } from "react-router-dom";
import { useGetRecipesQuery } from "./recipiesSlice.js";
import RecipesListItem from "./RecipesListItem.jsx";
import { useState } from "react";

const RecipesList = () => {
    const { recipesId } = useParams();
    const { data, isLoading, isError, error } = useGetRecipesQuery(recipesId);
    const [x, setX] = useState(10);
    console.log(data);

    let content;
    if (isLoading) {
        content = <div>Loading...</div>;
    } else if (isError) {
        content = <div>{error}</div>;
    } else {
        content = data.ids.slice(0, x).map(recipeId => {
            return <RecipesListItem key={recipeId} recipeId={recipeId} />;
        });
    }

    return (
        <div>
            <div className="recipes-list py-3xl gap-fluid-m-l">{content}</div>
        </div>
    );
};

export default RecipesList;
