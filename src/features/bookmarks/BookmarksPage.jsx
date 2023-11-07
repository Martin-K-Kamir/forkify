import { useSelector } from "react-redux";
import { selectAllBookmarks, selectTotalBookmarks } from "./bookmarksSlice.js";
import RecipesList from "../recipes/RecipesList.jsx";
import { useEffect, useRef, useState } from "react";
import Icon from "../../components/Icon.jsx";
import Select from "../../components/Select.jsx";

const BookmarksPage = () => {
    const bookmarks = useSelector(selectAllBookmarks);
    const bookmarksTotal = useSelector(selectTotalBookmarks);

    const [sort, setSort] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [recipes, setRecipes] = useState(bookmarks);

    const searchRef = useRef();

    const sortOptions = [
        { label: "Newest", value: "newest" },
        { label: "Oldest", value: "oldest" },
    ];

    const filterOptions = [
        { label: "All", value: "all" },
        { label: "Bookmarks", value: "bookmarks" },
        { label: "My Recipes", value: "myRecipes" },
    ];

    const areBookmarksEmpty = bookmarks.length === 0;

    useEffect(() => {
        const filteredRecipes = bookmarks.filter(bookmark => {
            return bookmark.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
        });

        setRecipes(filteredRecipes);
    }, [searchTerm]);

    useEffect(() => {
        if (sort?.value === "newest") {
            setRecipes(prevState => sortByNewest(prevState));
        } else if (sort?.value === "oldest") {
            setRecipes(prevState => sortByOldest(prevState));
        }
    }, [sort, searchTerm]);

    const sortByNewest = arr => {
        return [...arr].sort((a, b) =>
            b.bookmarkDate.localeCompare(a.bookmarkDate)
        );
    };

    const sortByOldest = arr => {
        return [...arr].sort((a, b) =>
            a.bookmarkDate.localeCompare(b.bookmarkDate)
        );
    };

    const handleSelectChange = option => {
        setSort(option);
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
                            Your Bookmarks & Your Recipes
                        </h1>
                        <p className="f-size-fluid-1 mt-3xs text-zinc-200">
                            {bookmarksTotal} recipes bookmarked. 10 Added
                            Recipes.
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
                                onChange={handleSelectChange}
                                value={sort}
                                label="Filter by"
                            />
                            <Select
                                options={sortOptions}
                                onChange={handleSelectChange}
                                value={sort}
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

export default BookmarksPage;
