import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import Icon from "./Icon.jsx";
import { nanoid } from "@reduxjs/toolkit";

const Select = ({label, options, value, onChange, size = "md", className, backgroundClassName, ...rest}) => {
    const idRef = useRef(nanoid());
    const [currentValue, setCurrentValue] = useState(value);
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef();

    const selectClasses = classNames(
        "relative no-select",
        {
            "radius-1": !isOpen,
            "radius-top-1 shadow-xl": isOpen,
            "bg-zinc-800": !backgroundClassName,
            "f-size--1": size === "sm" || size === "md",
            "f-size-1": size === "lg",
        },
        className,
        backgroundClassName
    );

    const labelClasses = classNames(
        "cursor-pointer flex align-items-center justify-content-between gap-xs line-height-1 text-nowrap",
        {
            "px-2xs py-3xs": size === "sm",
            "px-xs py-2xs": size === "md",
            "px-s py-xs": size === "lg",
        }
    )

    const listClasses = classNames(
        "bottom-1 left-0 translate-y-full w-full absolute bg-inherit overflow-hidden",
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

    function handleOutsideClick(e) {
        if (!ref.current?.contains(e.target)) {
            setIsOpen(false);
        }
    }

    function handleClick() {
        setIsOpen(prevIsOpen => !prevIsOpen);
    }

    function handleKeyDown(e) {
        const focusableElements = 'li[role="option"]:not([aria-disabled="true"])';
        const elements = document.querySelectorAll(focusableElements);
        const currentIndex = Array.from(elements).indexOf(document.activeElement);

        if (e.key === "Enter") {
            setIsOpen(prevIsOpen => !prevIsOpen);
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (!isOpen) {
                setIsOpen(true);
            } else if (currentIndex < elements.length - 1) {
                elements[currentIndex + 1].focus();
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (currentIndex > 0) {
                elements[currentIndex - 1].focus();
            } else if (isOpen) {
                setIsOpen(false);
                ref.current.focus();
            }
        } else if (e.key === "Tab" && currentIndex === elements.length - 1) {
            setIsOpen(false);
        }
    }

    function handleChange(option) {
        if (option.value === currentValue?.value) {
            onChange({value: "default"});
            setCurrentValue({value: "default"});
        } else {
            onChange(option);
            setCurrentValue(option);
        }
        setIsOpen(false);
    }

    const renderedOptions = options.map((option, i, arr) => {
        const classes = classNames("cursor-pointer outline-none bg-zinc-700//focus", {
            "text-blue-200": option.value === value?.value,
            "px-2xs py-3xs": size === "sm",
            "px-xs py-3xs": size === "md",
            "px-s py-2xs": size === "lg",
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
            onClick={handleClick}
            onKeyDown={handleKeyDown}
        >
            <label id={`label-${idRef.current}`} className="sr-only">
                {label}
            </label>
            <div
                className={labelClasses}
            >
                <div>
                    {value?.label ?? label ?? "Select an option"}
                    {/* This div is used to pre-render all possible select options offscreen.
                    This ensures that the width of the select component is set to the width of the widest option,
                    preventing any width changes when different options are selected.*/}
                    <div aria-hidden="true" className="opacity-0 invisible pointer-events-none h-0">
                        <div>{value?.label ?? label ?? "Select an option"}</div>
                        {options.map(option => <div>{option.label}</div>)}
                    </div>
                </div>
                <Icon type={isOpen ? "expandLess" : "expandMore"} className="f-size-2"/>
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
