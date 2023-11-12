import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLazyGetRecipesQuery } from "./recipiesSlice.js";
import { addAlert } from "../alert/alertSlice.js";

const SearchForm = ({ render }) => {
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

            navigate(`/search/${searchTerm}`);
        } catch (error) {
            dispatch(
                addAlert({
                    message: error.message,
                    isDanger: true,
                })
            );

            throw error;
        } finally {
            setSearchTerm("");
        }
    };

    const canSubmit = searchTerm.length > 0 && !isLoading;

    return render({
        isLoading,
        value: searchTerm,
        disabled: !canSubmit,
        onChange: handleChange,
        onSubmit: handleSubmit,
    });
};

export default SearchForm;
