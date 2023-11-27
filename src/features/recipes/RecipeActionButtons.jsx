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
import IconButton from "../../components/IconButton.jsx";
import Modal from "../../components/Modal.jsx";
import Button from "../../components/Button.jsx";
import useModal from "../../hooks/useModal.js";

const RecipeActionButtons = ({ recipe, className, onDeleteClick }) => {
    const isAboveMd = useMediaQuery("(width >= 48em)");
    const { recipeId } = useParams();
    const { isDropdownVisible, toggleDropdown, closeDropdown } = useDropdown();

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
        if (document.documentElement.dataset.theme === "dark") {
            document.documentElement.dataset.theme = "light";
            window.print();
            document.documentElement.dataset.theme = "dark";
            return;
        }

        window.print();
    };

    return (
        <div className={className}>
            {recipe.userId ? (
                <IconButton
                    color="error"
                    rounded="circle"
                    padSize="md"
                    onClick={onDeleteClick}
                    srOnly="Delete recipe"
                    title="Delete recipe"
                >
                    <Icon type="delete" className="f-size-1" />
                </IconButton>
            ) : (
                <IconButton
                    rounded="circle"
                    padSize="md"
                    onClick={handleBookmarkClick}
                    srOnly={
                        isBookmarked ? "Remove bookmark" : "Bookmark recipe"
                    }
                    title={isBookmarked ? "Remove bookmark" : "Bookmark recipe"}
                >
                    <Icon
                        type={isBookmarked ? "bookmarkRemove" : "bookmarkAdd"}
                        className="f-size-1"
                        fill={isBookmarked}
                    />
                </IconButton>
            )}
            <IconButton
                color="text-gray-050 bg-gray-600 text-zinc-050//dark bg-zinc-600//dark"
                rounded="circle"
                padSize="md"
                onClick={handlePrintClick}
                srOnly="Print recipe"
                title="Print recipe"
            >
                <Icon type="print" className="f-size-1" />
            </IconButton>
            <Dropdown
                isVisible={isDropdownVisible}
                onOutsideClick={closeDropdown}
                render={() => <SocialsShareButtons />}
                align={isAboveMd ? "center" : "start"}
                className="stack s-3xs p-2xs f-size--1"
                backgroundClassName="bg-gray-100 bg-gray-200//above-sm bg-zinc-800//dark bg-zinc-850//dark//above-sm"
                arrowClassName="text-gray-100 text-gray-200//above-sm text-zinc-800//dark text-zinc-850//dark//above-sm"
            >
                <IconButton
                    color="success"
                    rounded="circle"
                    padSize="md"
                    onClick={toggleDropdown}
                    srOnly="Click to open share options"
                    title="Click to open share options"
                >
                    <Icon type="share" className="f-size-1" />
                </IconButton>
            </Dropdown>
        </div>
    );
};

export default RecipeActionButtons;
