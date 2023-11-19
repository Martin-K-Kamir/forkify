import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import Icon from "./Icon.jsx";
import { nanoid } from "@reduxjs/toolkit";

const Select = ({ label, options, value, onChange, ...rest }) => {
    const idRef = useRef(nanoid());
    const [currentValue, setCurrentValue] = useState(value);
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef();

    const selectClasses = classNames(
        "select relative bg-zinc-800 f-size--1 no-select",
        {
            "radius-1": !isOpen,
            "radius-top-1": isOpen,
        }
    );

    const dropdownClasses = classNames(
        "bottom-1 left-0 translate-y-full stack s-2xs w-full absolute bg-inherit",
        {
            "radius-bottom-1": isOpen,
            "radius-1": !isOpen,
        }
    );

    useEffect(() => {
        document.addEventListener("click", handleOutsideClick, true);

        return () => document.removeEventListener("click", handleOutsideClick);
    }, []);

    function handleOutsideClick(e) {
        if (!ref.current?.contains(e.target)) {
            setIsOpen(false);
        }
    }

    function handleClick() {
        setIsOpen(prevIsOpen => !prevIsOpen);
    }

    function handleChange(option) {
        if (option.value === currentValue?.value) {
            onChange({ value: "default" });
            setCurrentValue({ value: "default" });
        } else {
            onChange(option);
            setCurrentValue(option);
        }
        setIsOpen(false);
    }

    const renderedOptions = options.map((option, i, arr) => {
        const isLast = i === arr.length - 1;

        const optionClasses = classNames("px-xs cursor-pointer", {
            "text-blue-200": option.value === value?.value,
            "pb-2xs": isLast,
        });

        return (
            <li
                className={optionClasses}
                key={option.value}
                onClick={() => handleChange(option)}
                role="option"
                tabIndex={-1}
                aria-selected={option.value === value?.value}
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
        >
            <label id={`label-${idRef.current}`} className="sr-only">
                {label}
            </label>
            <div
                className="cursor-pointer flex align-items-center justify-content-between gap-s line-height-1 text-nowrap px-xs py-2xs"
                onClick={handleClick}
            >
                {value?.label ?? label ?? "Select an option"}
                {isOpen ? (
                    <Icon type="expandLess" className="f-size-2" />
                ) : (
                    <Icon type="expandMore" className="f-size-2" />
                )}
            </div>
            {isOpen && (
                <ul
                    className={dropdownClasses}
                    role="listbox"
                    id={`listbox-${idRef.current}`}
                    aria-live="polite"
                >
                    {renderedOptions}
                </ul>
            )}
        </div>
    );
};

export default Select;
