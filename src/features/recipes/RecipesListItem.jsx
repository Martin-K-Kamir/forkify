import { useGetRecipesQueryState } from "./recipiesSlice.js";
import { useParams } from "react-router-dom";
import React from "react";
import { Link } from "react-router-dom";
import { capitalazeForEach } from "../../utilities.js";
let RecipesListItem = ({ recipeId }) => {
    const { recipesId } = useParams();

    const recipe = useGetRecipesQueryState(recipesId, {
        selectFromResult: ({ data }) => data.entities[recipeId],
    });

    const { image_url: image, title, publisher, id } = recipe;

    return (
        <li className="container flex flex-direction-column justify-self-center bg-zinc-800 radius-1 overflow-hidden w-full max-w-s//below-md mb-xs//below-sm">
            <img
                className="w-full aspect-ratio-16x9 object-cover"
                src={image}
                alt=""
            />
            <div className="flex flex-direction-column justify-content-between align-items-start h-full p-m pt-s">
                <div>
                    <h2 className="f-family-secondary f-size-2 f-size-1//above-sm f-size-2//container-above-sm f-weight-medium">
                        {capitalazeForEach(title)}
                    </h2>
                    <p className="f-size-1 f-size--1//above-sm f-size-1//container-above-sm mt-2xs text-zinc-300">
                        by {publisher}
                    </p>
                </div>
                <Link
                    to={id}
                    className="bg-blue-700 text-zinc-050 text-no-decoration text-center f-weight-medium f-size-1 f-size--1//above-sm f-size-1//container-above-sm line-height-1 radius-1 px-m py-xs mt-l w-full//below-sm w-full//container-above-sm"
                >
                    View Recipe
                </Link>
            </div>
        </li>
    );
};

RecipesListItem = React.memo(RecipesListItem);

export default RecipesListItem;
