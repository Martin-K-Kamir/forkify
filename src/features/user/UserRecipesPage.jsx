import { useSelector } from "react-redux";
import RecipesList from "../recipes/RecipesList.jsx";
import { useEffect, useRef, useState } from "react";
import Icon from "../../components/Icon.jsx";
import Select from "../../components/Select.jsx";
import {
    selectAllUserBookmarks,
    selectAllUserRecipes,
    selectTotalUserBookmarks,
    selectTotalUserRecipes,
    selectAllUserStoredRecipes,
} from "./userSlice.js";
import { LiaObjectGroup } from "react-icons/lia";

const UserRecipesPage = () => {
    const userBookmarks = useSelector(selectAllUserBookmarks);
    const userBookmarksTotal = useSelector(selectTotalUserBookmarks);
    const userRecipes = useSelector(selectAllUserRecipes);
    const userRecipesTotal = useSelector(selectTotalUserRecipes);
    const allUserStoredRecipes = useSelector(selectAllUserStoredRecipes);

    const [selectedFilter, setSelectedFilter] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [recipes, setRecipes] = useState(allUserStoredRecipes);

    const searchRef = useRef();

    const dateOptions = [
        { label: "Newest", value: "newest" },
        { label: "Oldest", value: "oldest" },
    ];

    const filterOptions = [
        { label: "Bookmarks", value: "bookmarks" },
        { label: "My Recipes", value: "myRecipes" },
    ];

    const areBookmarksEmpty = userBookmarks.length === 0;

    useEffect(() => {
        const filteredRecipes = allUserStoredRecipes.filter(bookmark => {
            return bookmark.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
        });

        setRecipes(filteredRecipes);
    }, [searchTerm]);

    useEffect(() => {
        const value = selectedDate?.value;
        console.log(value);
        if (value === "newest") {
            setRecipes(prevRecipes => sortByNewest(prevRecipes));
        } else if (value === "oldest") {
            setRecipes(prevRecipes => sortByOldest(prevRecipes));
        } else if (value === null) {
            setRecipes(allUserStoredRecipes);
        }
    }, [selectedDate, searchTerm]);

    useEffect(() => {
        const value = selectedFilter?.value;

        if (value === "bookmarks") {
            setRecipes(prevRecipes => getBookmarks(prevRecipes));
        } else if (value === "myRecipes") {
            setRecipes(prevRecipes => getUserRecipes(prevRecipes));
        } else if (value === null) {
            setRecipes(allUserStoredRecipes);
        }
    }, [selectedFilter, searchTerm]);

    const sortByNewest = arr => {
        return [...arr].sort((a, b) => b.sortDate.localeCompare(a.sortDate));
    };

    const sortByOldest = arr => {
        return [...arr].sort((a, b) => a.sortDate.localeCompare(b.sortDate));
    };

    const getBookmarks = arr => {
        return arr.filter(recipe => recipe.isBookmarked);
    };

    const getUserRecipes = arr => {
        console.log(arr);
        return arr.filter(recipe => recipe.isUserRecipe);
    };

    const handleSelectFilterChange = option => {
        setSelectedFilter(option);
    };

    const handleSelectDateChange = option => {
        setSelectedDate(option);
    };

    const handleSearchChange = e => {
        setSearchTerm(e.target.value);
    };

    const handleSearchClick = () => {
        searchRef.current.focus();
    };

    return (
        <div>
            {!areBookmarksEmpty && (
                <div className="relative flex flex-direction-column//below-lg align-items-center align-items-start//above-sm align-items-center//above-lg justify-content-between gap-m gap-s//above-sm z-index-100">
                    <header className="text-center text-left//above-sm">
                        <h1 className="f-size-fluid-2 f-weight-medium">
                            Your Recipes and Bookmarks
                        </h1>
                        <p className="f-size-fluid-1 mt-3xs text-zinc-200">
                            {userRecipesTotal} recipes and {userBookmarksTotal}{" "}
                            bookmarks
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
                            />
                        </div>

                        <div className="flex gap-xs gap-m//above-sm">
                            <Select
                                options={filterOptions}
                                onChange={handleSelectFilterChange}
                                value={selectedFilter}
                                label="Filter by"
                            />
                            <Select
                                options={dateOptions}
                                onChange={handleSelectDateChange}
                                value={selectedDate}
                                label="Sort by"
                            />
                        </div>
                    </form>
                </div>
            )}
            <div className="mt-fluid-m-l">
                {!areBookmarksEmpty && <RecipesList recipes={recipes} />}
                {areBookmarksEmpty && (
                    <p className="text-center f-size-1 f-weight-medium text-blue-100 flex align-items-center justify-content-center flex-direction-column gap-2xs">
                        <Icon type="bookmarkAdd" className="f-size-4" />
                        You haven't added any bookmarks to your list.
                    </p>
                )}
            </div>
        </div>
    );
};

export default UserRecipesPage;
