import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    useGetSearchQueriesQuery,
    useLazyGetRecipesQuery,
} from "./recipiesSlice.js";
import { addAlert } from "../alert/alertSlice.js";
import Icon from "../../components/Icon.jsx";
import classnames from "classnames";
import { useMediaQuery } from "@uidotdev/usehooks";
import { capitalizeWords } from "../../utilities.js";
import Button from "../../components/Button.jsx";
import IconButton from "../../components/IconButton.jsx";
import { nanoid } from "@reduxjs/toolkit";

const SearchRecipes = ({
    variant,
    formOptions,
    inputOptions,
    submitOptions,
    autocompleteOptions,
}) => {
    const idRef = useRef(nanoid());
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const isAboveMd = useMediaQuery("(width >= 48em)");

    const [searchTerm, setSearchTerm] = useState("");
    const [isInputFocused, setIsInputFocused] = useState(false);

    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);
    const autocompleteDividerRef = useRef(null);

    const { data: queries } = useGetSearchQueriesQuery();

    const [getRecipes, isLoading] = useLazyGetRecipesQuery({
        selectFromResult: ({ isLoading }) => isLoading,
    });

    const canSubmit = searchTerm.length > 0 && !isLoading;
    const includesBackground = str => str.includes("bg-");

    const renderedAutocompleteItems = queries
        ?.filter(query => {
            query = query.toLowerCase().trim();

            return query.includes(searchTerm.toLowerCase().trim());
        })
        .slice(0, 6)
        .map((query, i, arr) => {
            return (
                <li
                    key={query}
                    role="option"
                    aria-selected="false"
                    aria-posinset={i + 1}
                    aria-setsize={arr.length}
                    tabIndex={-1}
                >
                    <Button
                        to={`/search/${query}`}
                        variant="text"
                        color="secondary"
                        fontSize="f-size-inherit"
                        className="text-inherit gap-em text-no-decoration line-height-0 w-full"
                        align="start"
                        startIcon={
                            <Icon
                                type="search"
                                width="1.25em"
                                height="1.25em"
                            />
                        }
                    >
                        {capitalizeWords(query)}
                    </Button>
                </li>
            );
        });

    const showAutocomplete =
        isInputFocused &&
        searchTerm.length >= (autocompleteOptions?.lengthToShow ?? 1) &&
        (autocompleteOptions?.isEnabled ?? true) &&
        !isLoading &&
        renderedAutocompleteItems?.length > 0;

    const formClasses = classnames(
        "form flex w-full",
        {
            "max-w-l gap-s flex-direction-column//below-md": !variant,
            "max-w-s gap-xs": variant === "compact",
        },
        formOptions?.className
    );

    const inputClasses = classnames(
        "input-wrapper flex align-items-center w-full",
        {
            "bg-zinc-800": !includesBackground(inputOptions?.className ?? ""),
            "f-size-1 p-s": !variant,
            "f-size--1 px-xs py-2xs": variant === "compact",
            "radius-1": !showAutocomplete,
            "radius-top-1 shadow-2xl": showAutocomplete,
            "shadow-2xl":
                showAutocomplete &&
                isAboveMd &&
                (autocompleteOptions?.shouldOverlay ?? true),
        },
        inputOptions?.className
    );

    const autocompleteClasses = classnames("w-full radius-bottom-1", {
        none: !showAutocomplete,
        "absolute z-index-800 shadow-2xl":
            showAutocomplete &&
            isAboveMd &&
            (autocompleteOptions?.shouldOverlay ?? true),
    });

    useEffect(() => {
        const {
            backgroundColor,
            color,
            fontSize,
            fontWeight,
            paddingInline,
            paddingBlock,
        } = getComputedStyle(inputRef.current);
        const convertPxToRem = value => `${parseFloat(value) / 16}rem`;

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

    useEffect(() => {
        if (showAutocomplete) {
            document.addEventListener("click", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [showAutocomplete]);

    useEffect(() => {
        if (showAutocomplete) {
            setIsInputFocused(false);
        }

        if (searchTerm) {
            setSearchTerm("");
        }
    }, [location]);

    const handleFocus = () => {
        setIsInputFocused(true);
    };

    const handleBlur = e => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsInputFocused(false);
        }
    };

    const handleOutsideClick = useCallback(e => {
        if (
            !autocompleteRef.current.contains(e.target) &&
            !inputRef.current.contains(e.target)
        ) {
            setIsInputFocused(false);
        }
    }, []);

    const handleChange = e => {
        setSearchTerm(e.target.value);
    };

    const handleClear = () => {
        setSearchTerm("");
    };

    const handkeKeyUp = e => {
        if (e.key === "Escape") {
            setSearchTerm("");
        }
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
        <form
            id={formOptions?.id}
            className={formClasses}
            onSubmit={handleSubmit}
            role="search"
        >
            <div className="relative w-full" onBlur={handleBlur}>
                <div ref={inputRef} className={inputClasses}>
                    <label htmlFor="search-input" className="sr-only">
                        Search for recipes
                    </label>
                    <input
                        id="search-input"
                        type="text"
                        name="search"
                        className="bg-inherit w-full"
                        placeholder={
                            inputOptions?.placeholder ??
                            "Search over 1,000,000 recipes"
                        }
                        value={searchTerm}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onKeyUp={handkeKeyUp}
                        role="combobox"
                        aria-expanded={showAutocomplete}
                        aria-autocomplete="list"
                        aria-owns={`autocomplete-${idRef.current}`}
                    />
                    {searchTerm.length > 0 && (
                        <IconButton
                            color="secondary"
                            variant="text"
                            type="button"
                            onClick={handleClear}
                            srOnly="Clear search"
                            hover="absolute"
                        >
                            <Icon
                                type="close"
                                className={
                                    variant === "compact"
                                        ? "f-size-1"
                                        : "f-size-2"
                                }
                            />
                        </IconButton>
                    )}
                </div>
                <div ref={autocompleteRef} className={autocompleteClasses}>
                    <div
                        ref={autocompleteDividerRef}
                        className="h-px w-full bg-inherit brightness-200"
                        aria-hidden="true"
                    />
                    <ul
                        role="listbox"
                        className="stack s-3xs"
                        id={`autocomplete-${idRef.current}`}
                    >
                        {renderedAutocompleteItems}
                    </ul>
                </div>
            </div>
            {variant === "compact" ? (
                <IconButton
                    id={submitOptions?.id}
                    disabled={!canSubmit}
                    loading={isLoading}
                    color={submitOptions?.color}
                    padSize={submitOptions?.padSize ?? "md"}
                    className={submitOptions?.className}
                    srOnly="Search"
                >
                    <Icon className="f-size-2" type="search" />
                </IconButton>
            ) : (
                <Button
                    bold
                    id={submitOptions?.id}
                    disabled={!canSubmit}
                    loading={isLoading}
                    loadingIconSize={
                        submitOptions?.loadingIconSize ?? "f-size-3"
                    }
                    color={submitOptions?.color}
                    fontSize={submitOptions?.fontSize}
                    padSize={submitOptions?.padSize ?? "px-xl py-s"}
                    className={submitOptions?.className}
                >
                    {submitOptions?.content || "Search"}
                </Button>
            )}
        </form>
    );
};

export default SearchRecipes;
