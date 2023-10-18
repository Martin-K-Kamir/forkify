import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLazyGetRecipesQuery } from "./recipiesSlice.js";
import { useDispatch } from "react-redux";
import { addAlert } from "../alert/alertSlice.js";
import Icon from "../../components/Icon.jsx";
import SearchRecipesButtons from "./SearchRecipesButtons.jsx";

const SearchRecipes = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const [getRecipes, isLoading] = useLazyGetRecipesQuery({
        selectFromResult: ({ isLoading }) => isLoading,
    });

    const handleChange = e => {
        setSearchTerm(e.target.value);
    };

    const handleSubmit = async e => {
        try {
            e.preventDefault();
            await getRecipes(searchTerm, true).unwrap();
            navigate(`/recipes/${searchTerm}`);
        } catch (error) {
            dispatch(
                addAlert({
                    message: error.message,
                    isDanger: true,
                })
            );
        } finally {
            setSearchTerm("");
        }
    };

    const canSubmit = searchTerm.length > 0 && !isLoading;

    return (
        <div className="h-screen flex flex-direction-column align-items-center gap-xl pt-fluid-2xl-7xl">
            <h1 className="block f-family-secondary f-size-6 f-weight-medium line-height-1">
                Forkify
            </h1>

            <form
                className="form flex max-w-l gap-m w-full flex-direction-column//below-md"
                onSubmit={handleSubmit}
            >
                <input
                    type="text"
                    className="bg-zinc-800 p-s radius-1 w-full"
                    placeholder="Search over 1,000,000 recipes"
                    value={searchTerm}
                    onChange={handleChange}
                />
                <button
                    className="button radius-1 flex justify-content-center align-items-center"
                    disabled={!canSubmit}
                >
                    {isLoading ? (
                        <Icon
                            type="progressActivity"
                            className="animation-spin f-size-fluid-3"
                        />
                    ) : (
                        "Search"
                    )}
                </button>
            </form>

            <SearchRecipesButtons />
        </div>
    );
};

export default SearchRecipes;
