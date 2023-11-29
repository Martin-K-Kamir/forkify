import { useSelector } from "react-redux";
import RecipesList from "../recipes/RecipesList.jsx";
import React, { useEffect, useRef, useState } from "react";
import Icon from "../../components/Icon.jsx";
import Select from "../../components/Select.jsx";
import {
    selectTotalUserBookmarks,
    selectTotalUserRecipes,
    selectAllUserStoredRecipes,
} from "./userSlice.js";
import IconButton from "../../components/IconButton.jsx";
import useDocumentTitle from "../../hooks/useDocumentTitle.js";
import { useMediaQuery } from "@uidotdev/usehooks";
import { BELOW_SM } from "../../app/config.js";

const UserRecipesPage = () => {
    useDocumentTitle("Your Recipes and Bookmarks | Forkify");
    const isBelowSm = useMediaQuery(BELOW_SM);

    const allUserRecipes = useSelector(selectAllUserStoredRecipes);
    const userBookmarksTotal = useSelector(selectTotalUserBookmarks);
    const userRecipesTotal = useSelector(selectTotalUserRecipes);

    const areUserRecipesEmpty = allUserRecipes.length === 0;

    const [selectedFilter, setSelectedFilter] = useState(null);
    const [selectedSort, setSelectedSort] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [recipes, setRecipes] = useState(allUserRecipes);

    const searchRef = useRef();

    const sortOptions = [
        { label: "Newest", value: "newest" },
        { label: "Oldest", value: "oldest" },
    ];

    const filterOptions = [
        { label: "Bookmarks", value: "bookmarks" },
        { label: "My Recipes", value: "myRecipes" },
    ];

    useEffect(() => {
        const sortValue = selectedSort?.value;
        const filterValue = selectedFilter?.value;

        setRecipes(() => {
            let recipes = allUserRecipes;
            if (searchTerm) {
                recipes = allUserRecipes.filter(recipe =>
                    recipe.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                );
            }

            const filteredRecipes = recipes.filter(recipe => {
                if (filterValue === "bookmarks") {
                    return recipe.isBookmarked;
                } else if (filterValue === "myRecipes") {
                    return recipe.isUserRecipe;
                } else {
                    return true;
                }
            });

            const sortedRecipes =
                sortValue === "oldest"
                    ? sortByOldest(filteredRecipes)
                    : sortByNewest(filteredRecipes);

            return sortedRecipes;
        });
    }, [selectedSort, selectedFilter, searchTerm]);

    const sortByNewest = arr => {
        return [...arr].sort((a, b) => b.sortDate.localeCompare(a.sortDate));
    };

    const sortByOldest = arr => {
        return [...arr].sort((a, b) => a.sortDate.localeCompare(b.sortDate));
    };

    const handleSelectFilterChange = option => {
        setSelectedFilter(option);
    };

    const handleSelectDateChange = option => {
        setSelectedSort(option);
    };

    const handleSearchChange = e => {
        setSearchTerm(e.target.value);
    };

    const handleSearchClick = () => {
        searchRef.current.focus();
    };

    const handleClearSearch = () => {
        setSearchTerm("");
    };

    const handleKeyUp = e => {
        if (e.key === "Escape") {
            setSearchTerm("");
        }
    };

    return (
        <div>
            {!areUserRecipesEmpty && (
                <div className="relative flex flex-direction-column//below-lg align-items-center align-items-start//above-sm align-items-end//above-lg justify-content-between gap-m gap-s//above-sm z-index-100">
                    <header className="text-center text-left//above-sm">
                        <h1 className="f-size-fluid-2 f-weight-medium">
                            Your Recipes and Bookmarks
                        </h1>
                        <p className="f-size-fluid-1 mt-3xs text-gray-600 text-zinc-200//dark">
                            You have {userRecipesTotal} recipes and{" "}
                            {userBookmarksTotal} bookmarks.
                        </p>
                    </header>

                    <form
                        className="form flex justify-content-between align-items-end//below-md gap-xs w-full//below-lg"
                        onSubmit={e => e.preventDefault()}
                    >
                        <div
                            className="flex align-items-center gap-2xs bg-gray-050 bg-zinc-800//dark f-size--1 px-xs py-2xs radius-1 w-full max-w-2xs//above-sm absolute//below-sm//focus-within z-index-100"
                            onClick={handleSearchClick}
                        >
                            <Icon
                                className="f-size-1 flex-shrink-0"
                                type="search"
                            />

                            <label
                                htmlFor="search-my-recipes"
                                className="sr-only"
                            >
                                Search through your recipes
                            </label>
                            <input
                                id="search-my-recipes"
                                ref={searchRef}
                                type="text"
                                className="w-full bg-transparent"
                                placeholder="Search recipes"
                                onChange={handleSearchChange}
                                value={searchTerm}
                                onKeyUp={handleKeyUp}
                                aria-label="Search recipes"
                                aria-controls="recipes-list"
                                aria-autocomplete="list"
                            />

                            {searchTerm && !isBelowSm && <IconButton
                                    color="secondary"
                                    variant="text"
                                    onClick={handleClearSearch}
                                    srOnly="Clear search"
                                    hover="absolute"
                                >
                                    <Icon className="f-size-1" type="close"/>
                                </IconButton>}
                        </div>

                        <div className="flex gap-xs">
                            <Select
                                options={filterOptions}
                                onChange={handleSelectFilterChange}
                                value={selectedFilter}
                                label="Filter by"
                                aria-label="Filter recipes"
                                aria-controls="recipes-list"
                                aria-autocomplete="list"
                            />
                            <Select
                                options={sortOptions}
                                onChange={handleSelectDateChange}
                                value={selectedSort}
                                label="Sort by"
                                aria-label="Sort recipes"
                                aria-controls="recipes-list"
                                aria-autocomplete="list"
                            />
                        </div>
                    </form>
                </div>
            )}
            <div className="mt-fluid-m-l">
                {!areUserRecipesEmpty && <RecipesList recipes={recipes} />}
                {areUserRecipesEmpty && (
                    <p className="text-center f-size-1 f-weight-medium text-blue-600 text-blue-100//dark flex align-items-center justify-content-center flex-direction-column gap-2xs">
                        <Icon type="bookmarkAdd" className="f-size-4" />
                        You don't have any recipes or bookmarks yet.
                    </p>
                )}
            </div>
        </div>
    );
};

export default UserRecipesPage;
