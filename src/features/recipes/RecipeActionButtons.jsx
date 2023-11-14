import Icon from "../../components/Icon.jsx";
import React from "react";
import {
    selectUserBookmarkById,
    useUpdateBookmarkMutation,
} from "../user/userSlice.js";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import classnames from "classnames";
import Dropdown from "../../components/Dropdown.jsx";
import useDropdown from "../../hooks/useDropdown.js";
import SocialsShareButtons from "../../components/SocialsShareButtons.jsx";
import { useMediaQuery } from "@uidotdev/usehooks";

const RecipeActionButtons = ({ recipe, className, onDeleteClick }) => {
    const isAboveMd = useMediaQuery("(width >= 48em)");
    const { recipeId } = useParams();
    const { isDropdownVisible, toggleDropdown, closeDropdown } = useDropdown();

    const classes = classnames(
        "flex align-items-center gap-2xs bg-zinc-800 px-2xs py-2xs radius-pill",
        className
    );

    const [updateBookmark] = useUpdateBookmarkMutation({
        selectFromResult: () => ({}),
    });

    const bookmarkRecipe = useSelector(state =>
        selectUserBookmarkById(state, recipeId)
    );

    const isBookmarked = bookmarkRecipe?.isBookmarked ?? recipe?.isBookmarked;

    const handleBookmarkClick = () => {
        updateBookmark({ id: recipeId, isBookmarked: !isBookmarked });
    };

    const handlePrintClick = () => {
        window.print();
    };

    return (
        <div className={classes}>
            {recipe.userId ? (
                <button
                    onClick={onDeleteClick}
                    className="flex justify-content-center align-items-center p-3xs p-2xs//above-sm radius-circle bg-red-700"
                >
                    <Icon type="delete" className="f-size-1" />
                </button>
            ) : (
                <button
                    onClick={handleBookmarkClick}
                    className="flex justify-content-center align-items-center p-3xs p-2xs//above-sm radius-circle bg-blue-700"
                >
                    <Icon
                        type={isBookmarked ? "bookmarkRemove" : "bookmarkAdd"}
                        className="f-size-1"
                        fill={isBookmarked}
                    />
                </button>
            )}
            <button
                className="flex justify-content-center align-items-center p-3xs p-2xs//above-sm radius-circle bg-zinc-600"
                onClick={handlePrintClick}
            >
                <Icon type="print" className="f-size-1" />
            </button>
            <Dropdown
                isVisible={isDropdownVisible}
                onOutsideClick={closeDropdown}
                render={() => <SocialsShareButtons />}
                align={isAboveMd ? "center" : "right"}
            >
                <button
                    className="flex justify-content-center align-items-center p-3xs p-2xs//above-sm radius-circle bg-green-700"
                    onClick={toggleDropdown}
                >
                    <Icon type="share" className="f-size-1" />
                </button>
            </Dropdown>
        </div>
    );
};

export default RecipeActionButtons;
