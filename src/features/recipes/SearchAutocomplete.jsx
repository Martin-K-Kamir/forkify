import React from "react";
import Button from "../../components/Button.jsx";
import Icon from "../../components/Icon.jsx";
import { capitalizeWords } from "../../utilities.js";

const SearchAutocomplete = ({
    idRef,
    data,
    className,
    options,
    renderDivider,
}) => {
    const addHyphens = str => {
        return str.split(" ").join("-");
    };

    const renderedListItems = data?.map((query, i, arr) => (
        <li
            key={query}
            role="option"
            aria-posinset={i + 1}
            aria-setsize={arr.length}
        >
            <Button
                to={`/search/${addHyphens(query)}`}
                variant="text"
                color="color-inherit"
                fontSize="f-size-inherit"
                className="text-inherit gap-2xs text-no-decoration line-height-0 w-full"
                align="start"
                startIcon={
                    <Icon type="search" width="1.25em" height="1.25em" />
                }
            >
                {capitalizeWords(query)}
            </Button>
        </li>
    ));

    return (
        <div className={className}>
            {renderDivider()}
            <ul
                role="listbox"
                className="stack s-3xs"
                id={`autocomplete-${idRef}`}
                aria-label="suggestions"
                aria-live="polite"
            >
                {renderedListItems}
            </ul>
        </div>
    );
};

export default SearchAutocomplete;
