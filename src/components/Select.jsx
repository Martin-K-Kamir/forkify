import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import Icon from "./Icon.jsx";

const Select = ({ label, options, value, onChange }) => {
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
            onChange({value: "default"});
            setCurrentValue({value: "default"});
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
            <div
                className={optionClasses}
                key={option.value}
                onClick={() => handleChange(option)}
                role="option"
                aria-selected={option.value === value?.value}
            >
                {option.label}
            </div>
        );
    });

    return (
        <div className={selectClasses} ref={ref} role="select">
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
            {isOpen && <div className={dropdownClasses}>{renderedOptions}</div>}
        </div>
    );
};

export default Select;
