import { useSelector } from "react-redux";
import RecipesList from "../recipes/RecipesList.jsx";
import { useEffect, useRef, useState } from "react";
import Icon from "../../components/Icon.jsx";
import Select from "../../components/Select.jsx";
import {
    selectTotalUserBookmarks,
    selectTotalUserRecipes,
    selectAllUserStoredRecipes,
} from "./userSlice.js";

const UserRecipesPage = () => {
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
                <div className="relative flex flex-direction-column//below-lg align-items-center align-items-start//above-sm align-items-center//above-lg justify-content-between gap-m gap-s//above-sm z-index-100">
                    <header className="text-center text-left//above-sm">
                        <h1 className="f-size-fluid-2 f-weight-medium">
                            Your Recipes and Bookmarks
                        </h1>
                        <p className="f-size-fluid-1 mt-3xs text-zinc-200">
                            You have {userRecipesTotal} recipes and{" "}
                            {userBookmarksTotal} bookmarks.
                        </p>
                    </header>

                    <form className="form flex justify-content-between align-items-end//below-md flex-direction-column//below-sm gap-xs gap-m//above-sm w-full//below-lg">
                        <div
                            className="flex align-items-center gap-2xs bg-zinc-800 f-size--1 px-xs py-2xs radius-1 w-full max-w-2xs//above-sm"
                            onClick={handleSearchClick}
                        >
                            <Icon
                                className="f-size-2 flex-shrink-0"
                                type="search"
                            />

                            <input
                                ref={searchRef}
                                type="text"
                                className="w-full bg-transparent"
                                placeholder="Search recipes"
                                onChange={handleSearchChange}
                                value={searchTerm}
                                onKeyUp={handleKeyUp}
                            />

                            <button
                                className={`flex ${
                                    searchTerm ? "" : "opacity-0 invisible"
                                }`}
                                onClick={handleClearSearch}
                                type="button"
                            >
                                <Icon
                                    className="f-size-1 flex-shrink-0"
                                    type="close"
                                />
                            </button>
                        </div>

                        <div className="flex gap-xs gap-m//above-sm">
                            <Select
                                options={filterOptions}
                                onChange={handleSelectFilterChange}
                                value={selectedFilter}
                                label="Filter by"
                            />
                            <Select
                                options={sortOptions}
                                onChange={handleSelectDateChange}
                                value={selectedSort}
                                label="Sort by"
                            />
                        </div>
                    </form>
                </div>
            )}
            <div className="mt-fluid-m-l">
                {!areUserRecipesEmpty && <RecipesList recipes={recipes} />}
                {areUserRecipesEmpty && (
                    <p className="text-center f-size-1 f-weight-medium text-blue-100 flex align-items-center justify-content-center flex-direction-column gap-2xs">
                        <Icon type="bookmarkAdd" className="f-size-4" />
                        You don't have any recipes or bookmarks yet.
                    </p>
                )}
            </div>
        </div>
    );
};

export default UserRecipesPage;
