import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import {
    useGetSearchQueriesQuery,
    useLazyGetRecipesQuery,
} from "./recipiesSlice.js";
import { addAlert } from "../alert/alertSlice.js";
import Icon from "../../components/Icon.jsx";
import classnames from "classnames";
import Button from "../../components/Button.jsx";
import IconButton from "../../components/IconButton.jsx";
import SearchField from "./SearchField.jsx";

const SearchRecipesForm = ({
    size,
    formOptions,
    inputOptions,
    submitOptions,
    autocompleteOptions,
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const { data: searchQueries } = useGetSearchQueriesQuery();

    const [getRecipes, isLoading] = useLazyGetRecipesQuery({
        selectFromResult: ({ isLoading }) => isLoading,
    });

    const canSubmit = searchTerm.length > 0 && !isLoading;

    const formClasses = classnames(
        "form flex w-full",
        {
            "max-w-l gap-s flex-direction-column//below-md": size === "lg",
            "max-w-s gap-xs": size === "md",
        },
        formOptions?.className
    );

    const addHyphens = str => {
        return str.split(" ").join("-");
    };

    const handleSubmit = async e => {
        try {
            e.preventDefault();
            await getRecipes(searchTerm, true).unwrap();

            navigate(`/search/${addHyphens(searchTerm)}`);
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

    let button;
    if (size === "lg") {
        const {
            id,
            color,
            fontSize,
            className,
            padSize = "px-xl py-s",
            loadingIconSize = "f-size-3",
            content = "Search",
        } = submitOptions ?? {};

        button = (
            <Button
                bold
                id={id}
                disabled={!canSubmit}
                loading={isLoading}
                loadingIconSize={loadingIconSize}
                color={color}
                fontSize={fontSize}
                padSize={padSize}
                className={className}
            >
                {content}
            </Button>
        );
    } else if (size === "md") {
        const { id, color, className, padSize = "md" } = submitOptions ?? {};

        button = (
            <IconButton
                id={id}
                disabled={!canSubmit}
                loading={isLoading}
                color={color}
                padSize={padSize}
                className={className}
                srOnly="Search"
            >
                <Icon className="f-size-2" type="search" />
            </IconButton>
        );
    }

    return (
        <form
            id={formOptions?.id}
            className={formClasses}
            onSubmit={handleSubmit}
            role="search"
        >
            <SearchField
                size={size}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchQueries={searchQueries}
                inputOptions={inputOptions}
                autocompleteOptions={autocompleteOptions}
            />

            {button}
        </form>
    );
};

export default SearchRecipesForm;
