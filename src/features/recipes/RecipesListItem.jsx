import React from "react";
import { Link } from "react-router-dom";
import { capitalizeWords } from "../../utilities.js";
import Button from "../../components/Button.jsx";
let RecipesListItem = ({ image_url: image, title, publisher, id }) => {
    return (
        <li className="flex flex-direction-column justify-self-center bg-zinc-800 radius-1 overflow-hidden w-full max-w-s//below-md">
            <img
                className="w-full aspect-ratio-16x9 object-cover"
                src={image}
                alt=""
                aria-hidden={true}
            />
            <div className="flex flex-direction-column justify-content-between align-items-start h-full p-m pt-s">
                <div>
                    <h2 className="f-family-secondary f-size-1 f-weight-medium">
                        {capitalizeWords(title)}
                    </h2>
                    <p className="f-size--1 mt-2xs text-zinc-300">
                        by {publisher}
                    </p>
                </div>
                <Button
                    to={id}
                    bold
                    fontSize="sm"
                    className="text-no-decoration mt-l w-full//below-sm"
                >
                    View Recipe
                </Button>
            </div>
        </li>
    );
};

RecipesListItem = React.memo(RecipesListItem);

export default RecipesListItem;
