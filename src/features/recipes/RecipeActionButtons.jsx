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

const RecipeActionButtons = ({
    recipe,
    className,
    clearClassName,
    backgroundClassName,
    onDeleteClick,
}) => {
    const isAboveMd = useMediaQuery("(width >= 48em)");
    const isAboveSm = useMediaQuery("(width >= 30em)");
    const { recipeId } = useParams();
    const { isDropdownVisible, toggleDropdown, closeDropdown } = useDropdown();

    const classes = classnames(
        {
            "bg-zinc-850": !backgroundClassName,
            "flex align-items-center gap-3xs gap-2xs//above-sm px-2xs px-xs//above-sm py-3xs py-2xs//above-sm radius-pill":
                !clearClassName,
        },
        backgroundClassName,
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
                <IconButton
                    color="error"
                    rounded="circle"
                    padSize={isAboveSm ? "md" : "sm"}
                    onClick={onDeleteClick}
                    srOnly="Delete recipe"
                    title="Delete recipe"
                >
                    <Icon type="delete" className="f-size-1" />
                </IconButton>
            ) : (
                <IconButton
                    rounded="circle"
                    padSize={isAboveSm ? "md" : "sm"}
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
                color="bg-zinc-600"
                rounded="circle"
                padSize={isAboveSm ? "md" : "sm"}
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
                align={isAboveMd ? "center" : "right"}
                className="stack s-3xs p-2xs text-zinc-100 f-size--1"
            >
                <IconButton
                    color="success"
                    rounded="circle"
                    padSize={isAboveSm ? "md" : "sm"}
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
