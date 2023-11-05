import { useParams } from "react-router-dom";
import {
    useGetRecipeQuery,
    useUpdateBookmarkMutation,
} from "./recipiesSlice.js";
import Icon from "../../components/Icon.jsx";
import { capitalazeForEach } from "../../utilities.js";
import { useEffect, useState } from "react";
import Fraction from "fraction.js";
import { useSelector } from "react-redux";
import { selectBookmarkById } from "../bookmarks/bookmarksSlice.js";
import SingleRecipe from "./SingleRecipe.jsx";

const SingleRecipePage = () => {
    const { recipeId } = useParams();
    const {
        data: recipe,
        isLoading,
        isError,
        isSuccess,
        error,
    } = useGetRecipeQuery(recipeId);

    if (isLoading) {
        return (
            <div className="flex justify-content-center">
                <Icon
                    type="progressActivity"
                    className="animation-spin f-size-5"
                />
            </div>
        );
    } else if (isError) {
        return (
            <div className="text-center f-size-1 f-weight-medium text-red-100 flex align-items-center justify-content-center flex-direction-column gap-2xs">
                <Icon type="warning" className="f-size-3" />
                {error?.message || "Something went wrong! Please try again."}
            </div>
        );
    } else if (isSuccess) {
        return <SingleRecipe recipe={recipe} />;
    }

    return null;
};

export default SingleRecipePage;
