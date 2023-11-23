import React, { useEffect, useRef, useState } from "react";
import SearchInput from "./SearchInput.jsx";
import SearchAutocomplete from "./SearchAutocomplete.jsx";
import { nanoid } from "@reduxjs/toolkit";
import { useLocation } from "react-router-dom";
import classnames from "classnames";
import { useMediaQuery } from "@uidotdev/usehooks";

const SearchField = ({
    size,
    searchTerm,
    setSearchTerm,
    searchQueries,
    inputOptions,
    autocompleteOptions,
}) => {
    const location = useLocation();
    const isAboveMd = useMediaQuery("(min-width: 768px)");

    const idRef = useRef(nanoid());
    const fieldRef = useRef(null);
    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);
    const dividerRef = useRef(null);

    const [isFocused, setIsFocused] = useState(false);
    const [autocompleteData, setAutocompleteData] = useState([]);
    const [renderAutocomplete, setRenderAutocomplete] = useState(false);

    useEffect(() => {
        // Set styles for autocomplete based on input's computed styles
        const input = inputRef.current;
        const autocomplete = autocompleteRef.current;
        const divider = dividerRef.current;

        const {
            backgroundColor,
            color,
            fontSize,
            fontWeight,
            paddingInline,
            paddingBlock,
        } = getComputedStyle(input);
        const convertPxToRem = value => `${parseFloat(value) / 16}rem`;

        input.style.gap = convertPxToRem(paddingInline);

        Object.assign(autocomplete.style, {
            backgroundColor,
            color,
            fontWeight,
            fontSize: convertPxToRem(fontSize),
            paddingInline: convertPxToRem(paddingInline),
            paddingBlockEnd: convertPxToRem(paddingBlock),
        });

        Object.assign(divider.style, {
            marginBlockEnd: convertPxToRem(paddingBlock),
        });
    }, []);

    useEffect(() => {
        const { maxItems = 6 } = autocompleteOptions ?? {};

        const filteredSearchQueries = searchQueries
            ?.filter(searchQuery => {
                searchQuery = searchQuery.toLowerCase().trim();

                return searchQuery.includes(searchTerm.toLowerCase().trim());
            })
            .slice(0, maxItems);

        setAutocompleteData(filteredSearchQueries);
    }, [searchTerm]);

    useEffect(() => {
        const { minSearchTermLength = 1, maxSearchTermLength = 100 } =
            autocompleteOptions ?? {};

        const length = searchTerm.length;

        const shouldRenderAutocomplete =
            isFocused &&
            length >= minSearchTermLength &&
            length <= maxSearchTermLength &&
            autocompleteData?.length > 0;

        setRenderAutocomplete(shouldRenderAutocomplete);
    }, [searchTerm, isFocused, autocompleteData]);

    useEffect(() => {
        if (!renderAutocomplete) return;

        document.addEventListener("click", handleOutsideClick);
        fieldRef.current.addEventListener("keydown", handleNavigateFocus);

        return () => {
            document.removeEventListener("click", handleOutsideClick);
            fieldRef.current?.removeEventListener(
                "keydown",
                handleNavigateFocus
            );
        };
    }, [renderAutocomplete]);

    useEffect(() => {
        if (renderAutocomplete) {
            setIsFocused(false);
        }

        if (searchTerm) {
            setSearchTerm("");
        }
    }, [location]);

    const inputClasses = classnames(
        "input-wrapper flex align-items-center w-full",
        {
            "bg-gray-050 bg-zinc-800//dark": !inputOptions?.backgroundClassName,
            "f-size-1 p-s": size === "lg",
            "f-size--1 px-xs py-2xs": size === "md",
            "radius-1": !renderAutocomplete,
            "radius-top-1 shadow-xl": renderAutocomplete,
            "shadow-2xl":
                renderAutocomplete &&
                isAboveMd &&
                (autocompleteOptions?.shouldOverlay ?? true),
        },
        inputOptions?.className,
        inputOptions?.backgroundClassName
    );

    const autocompleteClasses = classnames("w-full radius-bottom-1", {
        "none ": !renderAutocomplete,
        "absolute z-index-800 shadow-2xl":
            renderAutocomplete &&
            isAboveMd &&
            (autocompleteOptions?.shouldOverlay ?? true),
    });

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = e => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsFocused(false);
        }
    };

    const handleOutsideClick = e => {
        if (
            !autocompleteRef.current.contains(e.target) &&
            !inputRef.current.contains(e.target)
        ) {
            setIsFocused(false);
        }
    };

    const handleNavigateFocus = e => {
        const focusableElements =
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusable = Array.from(
            fieldRef.current.querySelectorAll(focusableElements)
        );

        const currentIndex = focusable.indexOf(document.activeElement);

        if (e.key === "ArrowUp") {
            e.preventDefault();
            if (currentIndex > 0) {
                focusable[currentIndex - 1].focus();
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (currentIndex < focusable.length - 1) {
                focusable[currentIndex + 1].focus();
            }
        }
    };

    const handleChange = e => {
        setSearchTerm(e.target.value);
    };

    const handleClear = () => {
        setSearchTerm("");
    };

    const handleEscape = e => {
        if (e.key === "Escape") {
            handleClear();
        }
    };

    return (
        <div ref={fieldRef} className="relative w-full" onBlur={handleBlur}>
            <SearchInput
                ref={inputRef}
                idRef={idRef.current}
                value={searchTerm}
                onChange={handleChange}
                onClearClick={handleClear}
                onKeyUp={handleEscape}
                onFocus={handleFocus}
                size={size}
                className={inputClasses}
                options={inputOptions}
            />
            <SearchAutocomplete
                ref={autocompleteRef}
                idRef={idRef.current}
                dividerRef={dividerRef}
                data={autocompleteData}
                className={autocompleteClasses}
                options={autocompleteOptions}
            />
        </div>
    );
};

export default SearchField;
