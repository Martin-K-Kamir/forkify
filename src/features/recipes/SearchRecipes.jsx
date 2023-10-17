import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLazyGetRecipesQuery } from "./recipiesSlice.js";
import Alert from "../../components/alert/Alert.jsx";

const recipes = [
    "Pizza",
    "Salad",
    "Tacos",
    "Cake",
    "Seafood",
    "Kebab",
    "Hamburger",
    "Pineapple",
    "Sausage",
];

const SearchRecipes = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [getRecipes, { isLoading, error }] = useLazyGetRecipesQuery();

    useEffect(() => {
        if (showAlert && !searchTerm) {
            setTimeout(() => {
                setShowAlert(false);
            }, 3_000);
        }
    }, [searchTerm, showAlert]);

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    const handleChange = e => {
        setSearchTerm(e.target.value);
    };

    const handleSubmit = async e => {
        try {
            e.preventDefault();
            await getRecipes(searchTerm, true).unwrap();
            navigate(`/recipes/${searchTerm}`);
        } catch {
            setShowAlert(true);
        }

        setSearchTerm("");
    };

    const renderedRecipes = recipes.map(recipe => {
        return (
            <button
                className="bg-zinc-800 text-zinc-100 text-alpha-700 px-m py-xs f-size--1 line-height-1 radius-pill"
                key={recipe}
            >
                {recipe}
            </button>
        );
    });

    return (
        <div className="h-screen flex flex-direction-column align-items-center gap-xl pt-fluid-2xl-7xl">
            {showAlert && (
                <Alert danger onClose={handleCloseAlert}>
                    {error?.message}
                </Alert>
            )}

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
                <button className="button radius-1">
                    {isLoading ? "Loading..." : "Search"}
                </button>
            </form>

            <div className="max-w-m flex flex-wrap justify-content-center gap-s">
                {renderedRecipes}
            </div>
        </div>
    );
};

export default SearchRecipes;
