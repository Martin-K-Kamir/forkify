import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useGetSearchQueriesQuery, useLazyGetRecipesQuery } from "./recipiesSlice.js";
import { addAlert } from "../alert/alertSlice.js";
import Icon from "../../components/Icon.jsx";
import classnames from "classnames";
import { useMediaQuery } from "@uidotdev/usehooks";

const SearchRecipes = ({
                           variant,
                           formOptions,
                           inputOptions,
                           submitOptions,
                           autocompleteOptions,
                       }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAboveMd = useMediaQuery("(width >= 48em)");
    const [searchTerm, setSearchTerm] = useState("");
    const inputRef = useRef(null);
    const clearRef = useRef(null);
    const autocompleteRef = useRef(null);
    const autocompleteDividerRef = useRef(null);

    const {data} = useGetSearchQueriesQuery();

    const [getRecipes, isLoading] = useLazyGetRecipesQuery({
        selectFromResult: ({isLoading}) => isLoading,
    });

    const showAutocomplete =
        searchTerm.length >= (autocompleteOptions?.lengthToShow ?? 2) &&
        (autocompleteOptions?.isEnabled ?? true) &&
        !isLoading;

    const canSubmit = searchTerm.length > 0 && !isLoading;
    const includesBackground = str => str.includes("bg-");

    const formClasses = classnames(
        "form flex w-full",
        {
            "max-w-l gap-s flex-direction-column//below-md": !variant,
            "max-w-s gap-xs": variant === "compact",
        },
        formOptions?.className
    );

    const inputClasses = classnames(
        "flex align-items-center w-full",
        {
            "bg-zinc-800": !includesBackground(inputOptions?.className ?? ""),
            "f-size-1 p-s": !variant,
            "f-size--1 px-xs py-2xs": variant === "compact",
            "radius-1": !showAutocomplete,
            "radius-top-1 shadow-2xl": showAutocomplete,
            "shadow-2xl": showAutocomplete && isAboveMd && (autocompleteOptions?.shouldOverlay ?? true),
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
        "w-full radius-bottom-1",
        {
            "none": !showAutocomplete,
            "absolute z-index-800 shadow-2xl": showAutocomplete && isAboveMd && (autocompleteOptions?.shouldOverlay ?? true),
        }
    );

    useEffect(() => {
        let {
            backgroundColor,
            color,
            fontSize,
            fontWeight,
            paddingInline,
            paddingBlock
        } = getComputedStyle(inputRef.current);
        const convertPxToRem = (value) => `${parseFloat(value) / 16}rem`;

        inputRef.current.style.gap = convertPxToRem(paddingInline);

        Object.assign(autocompleteRef.current.style, {
            backgroundColor,
            color,
            fontWeight,
            fontSize: convertPxToRem(fontSize),
            paddingInline: convertPxToRem(paddingInline),
            paddingBlockEnd: convertPxToRem(paddingBlock),
        });

        Object.assign(autocompleteDividerRef.current.style, {
            marginBlockEnd: convertPxToRem(paddingBlock),
        });
    }, []);

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

    const renderedAutocompleteItems = data?.filter(query => {
        query = query.toLowerCase().trim();

        return query.includes(searchTerm.toLowerCase().trim());
    }).slice(0, 5).map(query => {
        return (
            <li
                key={query}
                className="flex align-items-center gap-s"
                role="option"
                aria-selected="false"
            >
                <Icon type="search" className="f-size-1" />
                <span className="f-size-1">{query}</span>
            </li>
        );
    });

    return (
        <form id={formOptions?.id} className={formClasses} onSubmit={handleSubmit} role="search">
            <div className="relative w-full">
                <div ref={inputRef} className={inputClasses}>
                    <input
                        id={inputOptions?.id}
                        type="text"
                        className="bg-inherit w-full"
                        placeholder={inputOptions?.placeholder ?? "Search over 1,000,000 recipes"}
                        value={searchTerm}
                        onChange={handleChange}
                    />
                    {searchTerm.length > 0 && (
                        <button
                            ref={clearRef}
                            className="flex"
                            onClick={handleClear}
                            type="button"
                        >
                            <Icon type="close" width="1.25em" height="1.25em"/>
                        </button>
                    )}
                </div>
                <div ref={autocompleteRef} className={autocompleteClasses}>
                    <div ref={autocompleteDividerRef} className="h-px w-full bg-inherit brightness-200"
                         aria-hidden="true"/>
                    <ul role="listbox" className="stack s-2xs">
                        {renderedAutocompleteItems}
                    </ul>
                </div>
            </div>
            <button id={submitOptions?.id} className={submitClasses} disabled={!canSubmit}>
                {isLoading ? (
                    <Icon type="progressActivity" className="animation-spin f-size-fluid-3"/>
                ) : (
                    variant === "compact" ? (
                        <Icon className="f-size-2" type="search"/>
                    ) : (
                        submitOptions?.content || "Search"
                    )
                )}
            </button>
        </form>
    );
};

export default SearchRecipes;
