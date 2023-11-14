import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLazyGetRecipesQuery } from "./recipiesSlice.js";
import { addAlert } from "../alert/alertSlice.js";
import Icon from "../../components/Icon.jsx";
import classnames from "classnames";

const SearchForm = ({
    render,
    variant,
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

    const showAutocomplete =
        searchTerm.length >= (autocompleteOptions?.treshold ?? 1) &&
        (autocompleteOptions?.isEnabled ?? true) &&
        !isLoading;

    const canSubmit = searchTerm.length > 0 && !isLoading;

    let submitContent = "Search";
    if (variant === "compact") {
        submitContent = <Icon className="f-size-2" type="search"/>;
    } else if (submitOptions?.content) {
        submitContent = submitOptions.content;
    }

    const includesBackground = str => {
        return str.includes("bg-");
    }

    const formClasses = classnames(
        "form flex w-full",
        {
            "max-w-l gap-s flex-direction-column//below-md": !variant,
            "max-w-s gap-xs": variant === "compact",
        },
        formOptions?.className
    );

    const inputClasses = classnames(
        "radius-1 w-full",
        {
            "bg-zinc-800": !includesBackground(inputOptions?.className ?? ""),
            "f-size-1 p-s": !variant,
            "f-size--1 px-xs py-2xs": variant === "compact",
            "radius-bottom-0 shadow-2xl": showAutocomplete,
        },
        inputOptions?.className
    );

    const submitClasses = classnames(
        "flex justify-content-center align-items-center radius-1 f-weight-medium",
        {
            "bg-blue-700": !includesBackground(submitOptions?.className ?? ""),
            "f-size-1 px-xl py-s": !variant,
            "f-size--1 px-2xs py-2xs": variant === "compact",
        },
        submitOptions?.className
    );

    const autocompleteClasses = classnames(
        "absolute z-index-800 bg-zinc-900 w-full f-size--1 px-xs pb-2xs radius-1",
        {
            "radius-top-0 shadow-2xl": showAutocomplete,
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

    return (
        <form id={formOptions?.id} className={formClasses} onSubmit={handleSubmit}>
            <div className="relative w-full">
                <div className="relative w-full grid align-items-center">
                    <input
                        id={inputOptions?.id}
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
                            <Icon type="close" className="f-size-1"/>
                        </button>
                    )}
                </div>
                {showAutocomplete && (
                    <div className={autocompleteClasses}>
                        <div className="bg-zinc-700 h-px w-full mb-2xs"/>
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
            <button id={submitOptions?.id} className={submitClasses} disabled={!canSubmit}>
                {isLoading ? (
                    <Icon
                        type="progressActivity"
                        className="animation-spin f-size-fluid-3"
                    />
                ) : (
                    submitContent
                )}
            </button>
        </form>
    );
};

export default SearchForm;
