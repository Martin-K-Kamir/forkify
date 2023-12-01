import { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import Icon from "./Icon.jsx";
import { nanoid } from "@reduxjs/toolkit";

const Select = ({
    label,
    options,
    value,
    onChange,
    className,
    clearDefaultClassNames = false,
    size = "md",
    textActiveClassName = "text-blue-600 text-blue-200//dark",
    backgroundClassName = "bg-gray-050 bg-zinc-800//dark",
    backgroundHoverClassName = "bg-gray-200//hover bg-zinc-700//dark//hover",
    backgroundFocusClassName = "bg-gray-200//focus bg-zinc-700//dark//focus",
    ...rest
}) => {
    const ref = useRef();
    const idRef = useRef(nanoid());

    const [currentValue, setCurrentValue] = useState(value);
    const [isOpen, setIsOpen] = useState(false);

    const selectClasses = classNames(
        "relative no-select",
        {
            "radius-1": !isOpen,
            "radius-top-1 shadow-xl": isOpen,
            "f-size--1":
                size === "sm" || (size === "md" && !clearDefaultClassNames),
            "f-size-1": size === "lg" && !clearDefaultClassNames,
            [backgroundClassName]: !clearDefaultClassNames,
        },
        className
    );

    const labelClasses = classNames(
        "cursor-pointer flex align-items-center justify-content-between line-height-1 text-nowrap",
        {
            "px-2xs py-3xs gap-3xs": size === "sm" && !clearDefaultClassNames,
            "px-xs py-2xs gap-2xs": size === "md" && !clearDefaultClassNames,
            "px-s py-xs gap-xs": size === "lg" && !clearDefaultClassNames,
        }
    );

    const listClasses = classNames(
        "bottom-1 left-0 translate-y-full w-full absolute bg-inherit overflow-hidden pb-3xs",
        {
            "radius-1": !isOpen,
            "radius-bottom-1 shadow-xl": isOpen,
        }
    );

    useEffect(() => {
        document.addEventListener("click", handleOutsideClick, true);

        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    const getNavigationElements = () => {
        const focusableElements =
            'li[role="option"]:not([aria-disabled="true"])';
        const elements = Array.from(
            document.querySelectorAll(focusableElements)
        );
        const currentIndex = elements.indexOf(document.activeElement);
        return { elements, currentIndex };
    };

    const toggleIsOpen = useCallback(() => {
        setIsOpen(prevIsOpen => !prevIsOpen);
    }, []);

    const handleClick = useCallback(() => {
        toggleIsOpen();
    }, []);

    const handleOutsideClick = useCallback(
        e => {
            if (!ref.current?.contains(e.target)) {
                setIsOpen(false);
            }
        },
        [ref]
    );

    const handleEnterKey = useCallback(e => {
        if (e.target !== ref.current) return;

        toggleIsOpen();
    }, []);

    const handleArrowDownKey = useCallback(
        e => {
            e.preventDefault();
            const { elements, currentIndex } = getNavigationElements();

            if (!isOpen) {
                console.log("");
                setIsOpen(true);
            } else if (currentIndex < elements.length - 1) {
                elements[currentIndex + 1].focus();
            }
        },
        [isOpen]
    );

    const handleArrowUpKey = useCallback(
        e => {
            e.preventDefault();
            const { elements, currentIndex } = getNavigationElements();

            if (currentIndex > 0) {
                console.log("");
                elements[currentIndex - 1].focus();
            } else if (isOpen) {
                setIsOpen(false);
                ref.current.focus();
            }
        },
        [isOpen, ref]
    );

    const handleTabKey = useCallback(() => {
        const { elements, currentIndex } = getNavigationElements();

        if (currentIndex !== elements.length - 1) return;

        setIsOpen(false);
    }, []);

    const handleEscapeKey = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleKeyDown = useCallback(
        e => {
            switch (e.key) {
                case "Enter":
                    handleEnterKey(e);
                    break;
                case "ArrowDown":
                    handleArrowDownKey(e);
                    break;
                case "ArrowUp":
                    handleArrowUpKey(e);
                    break;
                case "Tab":
                    handleTabKey();
                    break;
                case "Escape":
                    handleEscapeKey();
                default:
                    break;
            }
        },
        [handleEnterKey, handleArrowDownKey, handleArrowUpKey, handleTabKey]
    );

    const handleChange = useCallback(
        option => {
            if (option.value === currentValue?.value) {
                onChange({ value: "default" });
                setCurrentValue({ value: "default" });
            } else {
                onChange(option);
                setCurrentValue(option);
            }
            setIsOpen(false);
        },
        [currentValue, onChange]
    );

    const handleBlur = useCallback(e => {
        if (!ref.current?.contains(e.relatedTarget)) {
            setIsOpen(false);
        }
    }, []);

    const renderedOptions = options.map((option, i, arr) => {
        const classes = classNames("cursor-pointer outline-none", {
            "px-2xs py-2xs": size === "sm" && !clearDefaultClassNames,
            "px-xs py-3xs": size === "md" && !clearDefaultClassNames,
            "px-s py-2xs": size === "lg" && !clearDefaultClassNames,
            [textActiveClassName]:
                option.value === value?.value && !clearDefaultClassNames,
            [backgroundFocusClassName]: !clearDefaultClassNames,
            [backgroundHoverClassName]: !clearDefaultClassNames,
        });

        return (
            <li
                className={classes}
                key={option.value}
                onClick={() => handleChange(option)}
                onKeyDown={e => e.key === "Enter" && handleChange(option)}
                role="option"
                tabIndex={0}
                aria-disabled={option.value === "default"}
                aria-hidden={option.value === "default"}
                aria-setsize={arr.length}
                aria-posinset={i + 1}
                aria-controls={`select-${idRef.current}`}
                aria-selected={option.value === value?.value}
                aria-labelledby={`label-${idRef.current}`}
            >
                {option.label}
            </li>
        );
    });

    return (
        <div
            {...rest}
            className={selectClasses}
            ref={ref}
            role="combobox"
            id={`select-${idRef.current}`}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-owns={`listbox-${idRef.current}`}
            aria-labelledby={`label-${idRef.current}`}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
        >
            <p className="sr-only">
                To open the select menu, press the down arrow key. To close the
                select menu, press the escape key. Press the enter key to select
                the currently focused option.
            </p>
            <div className={labelClasses} onClick={handleClick}>
                <div>
                    {value?.label ?? label ?? "Select an option"}
                    {/* This div is used to pre-render all possible select options offscreen.
                    This ensures that the width of the select component is set to the width of the widest option,
                    preventing any width changes when different options are selected.*/}
                    <div
                        aria-hidden="true"
                        className="opacity-0 invisible pointer-events-none h-0"
                    >
                        <div>{value?.label ?? label ?? "Select an option"}</div>
                        {options.map(option => (
                            <div key={option.label}>{option.label}</div>
                        ))}
                    </div>
                </div>
                <Icon
                    type={isOpen ? "expandLess" : "expandMore"}
                    className="f-size-2"
                />
            </div>
            {isOpen && (
                <ul
                    className={listClasses}
                    role="listbox"
                    id={`listbox-${idRef.current}`}
                    aria-live="polite"
                    data-focus-visible-outline="inline-bottom"
                >
                    {renderedOptions}
                </ul>
            )}
        </div>
    );
};

export default Select;
