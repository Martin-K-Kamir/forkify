import React from "react";
import Button from "../../components/Button.jsx";
import Icon from "../../components/Icon.jsx";
import { capitalizeWords } from "../../utilities.js";

const SearchAutocomplete = React.forwardRef(
    ({ idRef, dividerRef, data, className, options }, ref) => {
        const renderedListItems = data?.map((query, i, arr) => {
            return (
                <li
                    key={query}
                    role="option"
                    aria-posinset={i + 1}
                    aria-setsize={arr.length}
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

        return (
            <div ref={ref} className={className}>
                <div
                    ref={dividerRef}
                    className="h-px w-full bg-inherit brightness-200"
                    aria-hidden="true"
                />
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
    }
);

export default SearchAutocomplete;
