import classNames from "classnames";
import React, { useEffect, useRef } from "react";

let Field = ({ field, onChange, className }) => {
    const { id, label, isRequired, type, pattern, min, max, maxLength, value } =
        field;

    const textareaRef = useRef(null);

    useEffect(() => {
        if (type === "textarea") {
            textareaRef.current.addEventListener("input", handleSettingHeight);
        }

        return () => {
            if (type === "textarea") {
                textareaRef.current?.removeEventListener(
                    "input",
                    handleSettingHeight
                );
            }
        };
    }, []);

    const handleSettingHeight = e => {
        const textarea = e.target;
        textarea.style.height = "auto";
        const { scrollHeight } = textarea;
        textarea.style.height = `${scrollHeight}px`;
    };

    const fieldClasses = classNames(
        "field relative bg-zinc-800 bg-zinc-900//above-sm px-s py-xs radius-1 w-full cursor-text",
        className
    );

    const handleFocusClick = e => {
        e.target.querySelector("input")?.focus();
        e.target.querySelector("textarea")?.focus();
    };

    return (
        <div className={fieldClasses} onClick={handleFocusClick}>
            <div className="flex h-full w-full">
                <label
                    htmlFor={name}
                    className="cursor-text px-s line-height-1"
                >
                    {label}
                    {isRequired && "*"}
                </label>
                {type === "textarea" ? (
                    <textarea
                        ref={textareaRef}
                        id={id}
                        name={id}
                        className="bg-transparent w-full"
                        onChange={onChange}
                        value={value}
                        data-value={value.substring(0, 1)}
                        required={isRequired}
                        rows={2}
                        maxLength={maxLength}
                    />
                ) : (
                    <input
                        id={id}
                        name={id}
                        type={type}
                        className="bg-transparent mt-auto w-full line-height-1"
                        value={value}
                        onChange={onChange}
                        pattern={pattern}
                        min={min}
                        max={max}
                        maxLength={maxLength}
                        required={isRequired}
                    />
                )}
            </div>
        </div>
    );
};

Field = React.memo(Field, (prevProps, nextProps) => {
    return prevProps.field.value === nextProps.field.value;
});

export default Field;
