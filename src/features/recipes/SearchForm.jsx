import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLazyGetRecipesQuery } from "./recipiesSlice.js";
import { addAlert } from "../alert/alertSlice.js";
import Icon from "../../components/Icon.jsx";
import classnames from "classnames";

const SearchForm = ({
    render,
    formOptions,
    inputOptions,
    submitOptions,
    autocompleteOptions,
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const [getRecipes, isLoading] = useLazyGetRecipesQuery({
        selectFromResult: ({ isLoading }) => isLoading,
    });

    const renderAutocomplete =
        searchTerm.length >= (autocompleteOptions?.treshold ?? 1) &&
        (autocompleteOptions?.isEnabled ?? true) &&
        !isLoading;

    const formClasses = classnames(
        "form flex max-w-s gap-xs w-full",
        formOptions?.className
    );

    const inputClasses = classnames(
        "bg-zinc-900 f-size--1 px-xs py-2xs radius-1 w-full",
        inputOptions?.className,
        {
            "radius-bottom-0 shadow-2xl": renderAutocomplete,
        }
    );

    const submitClasses = classnames(
        "bg-blue-700 px-2xs py-2xs radius-1 flex justify-content-center align-items-center",
        submitOptions?.className
    );

    const autocompleteClasses = classnames(
        "absolute z-index-800 bg-zinc-900 w-full f-size--1 px-xs pb-2xs radius-1",
        {
            "radius-top-0 shadow-2xl": renderAutocomplete,
        }
    );

    const handleChange = e => {
        setSearchTerm(e.target.value);
    };

    const handleClear = () => {
        setSearchTerm("");
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

    return (
        <>
            {render ? (
                render({
                    isLoading,
                    value: searchTerm,
                    disabled: !canSubmit,
                    onChange: handleChange,
                    onSubmit: handleSubmit,
                })
            ) : (
                <form className={formClasses} onSubmit={handleSubmit}>
                    <div className="relative w-full">
                        <div className="relative w-full grid align-items-center">
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="Search over 1,000,000 recipes"
                                value={searchTerm}
                                onChange={handleChange}
                            />
                            {searchTerm.length > 0 && (
                                <button
                                    className="absolute bg-zinc-900 flex justify-self-end px-2xs"
                                    onClick={handleClear}
                                >
                                    <Icon type="close" className="f-size-1" />
                                </button>
                            )}
                        </div>
                        {renderAutocomplete && (
                            <div className={autocompleteClasses}>
                                <div className="bg-zinc-700 h-px w-full mb-2xs" />
                                <ul role="list" className="stack s-2xs">
                                    <li>Pizza</li>
                                    <li>Pasta</li>
                                    <li>Chicken</li>
                                    <li>Chicken</li>
                                    <li>Chicken</li>
                                    <li>Chicken</li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <button className={submitClasses} disabled={!canSubmit}>
                        {isLoading ? (
                            <Icon
                                type="progressActivity"
                                className="animation-spin f-size-fluid-3"
                            />
                        ) : (
                            submitOptions?.content ?? "Search"
                        )}
                    </button>
                </form>
            )}
        </>
    );
};

export default SearchForm;
