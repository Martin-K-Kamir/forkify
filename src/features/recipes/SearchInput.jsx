import IconButton from "../../components/IconButton.jsx";
import Icon from "../../components/Icon.jsx";
import React from "react";

const SearchInput = ({
    idRef,
    value,
    onChange,
    onClearClick,
    onFocus,
    onKeyUp,
    className,
    options,
    size,
}) => {
    const handleFocusCluck = e => {
        e.target.querySelector("input")?.focus();
    };

    return (
        <div className={className} onClick={handleFocusCluck}>
            <label htmlFor={`search-input-${idRef}`} className="sr-only">
                Use this field to search for recipes by name or ingredient. As
                you type, a list of suggestions will appear. Use the arrow keys
                to navigate through these suggestions. Press enter to select a
                highlighted suggestion and you'll be taken to the search results
                page. If the recipe you're looking for doesn't appear in the
                suggestions, you can still search for it. Just type it into the
                search box and press enter. To clear the search box, press the
                escape key.
            </label>
            <input
                id={`search-input-${idRef}`}
                type="text"
                name="search"
                className="bg-inherit w-full"
                placeholder={
                    options?.placeholder || "Search over 1,000,000 recipes"
                }
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                onKeyUp={onKeyUp}
                aria-autocomplete="list"
                autoComplete="off"
                aria-owns={`autocomplete-${idRef}`}
            />
            {value.length > 0 && (
                <IconButton
                    color="secondary"
                    variant="text"
                    type="button"
                    onClick={onClearClick}
                    srOnly="Clear search"
                    hover="absolute"
                >
                    <Icon
                        type="close"
                        className={size === "md" ? "f-size-1" : "f-size-2"}
                    />
                </IconButton>
            )}
        </div>
    );
};

export default SearchInput;
