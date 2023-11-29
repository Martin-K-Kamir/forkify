import classNames from "classnames";
import React, { useEffect, useRef } from "react";

let Field = ({ field, onChange, className }) => {
    const textareaRef = useRef(null);
    const inputRef = useRef(null);
    const fieldRef = useRef(null);

    const {
        id,
        label,
        isRequired,
        type,
        pattern,
        min,
        max,
        step,
        maxLength,
        value,
    } = field;

    const fieldClasses = classNames(
        "field relative bg-gray-300 bg-gray-200//above-sm bg-zinc-800//dark bg-zinc-900//dark//above-sm px-s py-xs radius-1 w-full cursor-text",
        className
    );

    let keyboardUsed = false;

    useEffect(() => {
        window.addEventListener("keydown", () => {
            keyboardUsed = true;
        });

        window.addEventListener("mousedown", () => {
            keyboardUsed = false;
        });

        if (type === "textarea") {
            textareaRef.current.addEventListener("input", handleSettingHeight);
            textareaRef.current.addEventListener("focus", handleFocus);
            textareaRef.current.addEventListener("blur", handleBlur);
        } else {
            inputRef.current.addEventListener("focus", handleFocus);
            inputRef.current.addEventListener("blur", handleBlur);
        }

        return () => {
            window.removeEventListener("keydown", () => {
                keyboardUsed = true;
            });

            window.removeEventListener("mousedown", () => {
                keyboardUsed = false;
            });

            if (type === "textarea") {
                textareaRef.current?.removeEventListener(
                    "input",
                    handleSettingHeight
                );
                textareaRef.current?.removeEventListener("focus", handleFocus);
                textareaRef.current?.removeEventListener("blur", handleBlur);
            } else {
                inputRef.current?.removeEventListener("focus", handleFocus);
                inputRef.current?.removeEventListener("blur", handleBlur);
            }
        };
    }, []);

    const handleSettingHeight = e => {
        const textarea = e.target;
        textarea.style.height = "auto";
        const { scrollHeight } = textarea;
        textarea.style.height = `${scrollHeight}px`;
    };

    const handleChange = e => {
        onChange(e);
    };

    const handleKeyPress = e => {
        if ([".", ",", "-"].includes(e.key)) {
            e.preventDefault();
        }
    };

    const handleFocus = e => {
        if (keyboardUsed) {
            e.target.dataset.focusVisible = "true";
        }
    };

    const handleBlur = e => {
        delete e.target.dataset.focusVisible;
    };

    const handleFocusClick = e => {
        e.target.querySelector("input")?.focus();
        e.target.querySelector("textarea")?.focus();
    };

    return (
        <div ref={fieldRef} className={fieldClasses} onClick={handleFocusClick}>
            <div className="flex h-full w-full">
                <label
                    htmlFor={id}
                    className="cursor-text px-s line-height-1 text-no-select pointer-events-none"
                >
                    {label}
                    {isRequired && " *"}
                </label>
                {type === "textarea" ? (
                    <textarea
                        ref={textareaRef}
                        id={id}
                        name={id}
                        className="bg-transparent w-full"
                        onChange={handleChange}
                        value={value}
                        data-value={value.substring(0, 1)}
                        required={isRequired}
                        rows={2}
                        maxLength={maxLength}
                    />
                ) : (
                    <input
                        ref={inputRef}
                        id={id}
                        name={id}
                        type={type}
                        className="bg-transparent mt-auto w-full line-height-1"
                        value={value}
                        onChange={handleChange}
                        onKeyDown={
                            type === "number" ? handleKeyPress : undefined
                        }
                        pattern={pattern}
                        min={min}
                        max={max}
                        maxLength={maxLength}
                        required={isRequired}
                        step={step}
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
