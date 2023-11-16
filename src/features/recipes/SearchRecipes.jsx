import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

const SearchRecipes = ({
    variant,
    formOptions,
    inputOptions,
    submitOptions,
    autocompleteOptions,
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const isAboveMd = useMediaQuery("(width >= 48em)");

    const [searchTerm, setSearchTerm] = useState("");
    const [isInputFocused, setIsInputFocused] = useState(false);

    const inputRef = useRef(null);
    const clearRef = useRef(null);
    const autocompleteRef = useRef(null);
    const autocompleteDividerRef = useRef(null);
    const autocompleteListRef = useRef(null);

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
        .map(query => {
            return (
                <li
                    key={query}
                    role="option"
                    className="gap-inherit"
                    aria-selected="false"
                >
                    <Link
                        to={`/search/${query}`}
                        className="flex align-items-center gap-inherit text-inherit text-no-decoration"
                    >
                        <Icon type="search" width="1.25em" height="1.25em" />
                        {capitalizeWords(query)}
                    </Link>
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
        "flex align-items-center w-full",
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

    const submitClasses = classnames(
        "flex justify-content-center align-items-center radius-1 f-weight-medium",
        {
            "bg-blue-700": !includesBackground(submitOptions?.className ?? ""),
            "f-size-1 px-xl py-s": !variant,
            "f-size--1 px-2xs py-2xs": variant === "compact",
        },
        submitOptions?.className
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

        Object.assign(autocompleteListRef.current.style, {
            gap: convertPxToRem(paddingInline),
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
                    <input
                        id={inputOptions?.id}
                        type="text"
                        className="bg-inherit w-full"
                        placeholder={
                            inputOptions?.placeholder ??
                            "Search over 1,000,000 recipes"
                        }
                        value={searchTerm}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onKeyUp={handkeKeyUp}
                    />
                    {searchTerm.length > 0 && (
                        <button
                            ref={clearRef}
                            className="flex"
                            onClick={handleClear}
                            type="button"
                        >
                            <Icon type="close" width="1.25em" height="1.25em" />
                        </button>
                    )}
                </div>
                <div ref={autocompleteRef} className={autocompleteClasses}>
                    <div
                        ref={autocompleteDividerRef}
                        className="h-px w-full bg-inherit brightness-200"
                        aria-hidden="true"
                    />
                    <ul
                        ref={autocompleteListRef}
                        role="listbox"
                        className="stack s-2xs"
                    >
                        {renderedAutocompleteItems}
                    </ul>
                </div>
            </div>
            {
                variant === "compact" ? (
                    <button
                        id={submitOptions?.id}
                        className={submitClasses}
                        disabled={!canSubmit}
                    >
                        <Icon className="f-size-2" type="search"/>
                    </button>
                ) : (
                    <Button
                        bold
                        id={submitOptions?.id}
                        disabled={!canSubmit}
                        loading={isLoading}
                        loadingIconSize={submitOptions?.loadingIconSize ?? "f-size-3"}
                        color={submitOptions?.color ?? "primary"}
                        fontSize={submitOptions?.fontSize ?? "md"}
                        padSize={submitOptions?.padSize ?? "px-xl py-s"}
                        className={submitOptions?.className}
                    >
                        {submitOptions?.content || "Search"}
                    </Button>
                )
            }
        </form>
    );
};

export default SearchRecipes;
