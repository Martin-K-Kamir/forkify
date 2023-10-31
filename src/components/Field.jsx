import classNames from "classnames";

const Field = ({
                   field,
                   onChange,
                   className,
               }) => {
    const {id, label, isRequired, type, pattern, min, max, maxLength, value} = field;
    const handleClick = e => {
        e.target.querySelector("input")?.focus();
    };

    const fieldClasses = classNames(
        "field relative bg-zinc-800 bg-zinc-900//above-sm px-s py-xs radius-1 w-full cursor-text",
        className
    );

    return (
        <div className={fieldClasses} onClick={handleClick}>
            {type === "textarea" ? (
                <div className="flex h-full w-full">
                    <label htmlFor={name} className="cursor-text px-s line-height-1">
                        {label}
                        {isRequired && "*"}
                    </label>
                    <textarea
                        id={id}
                        name={id}
                        className="mt-s bg-transparent w-full"
                        onChange={onChange}
                        value={value}
                        required={isRequired}
                    />
                </div>

            ) : (
                <div className="flex h-full w-full line-height-1">
                    <label htmlFor={name} className="cursor-text px-s">
                        {label}
                        {isRequired && "*"}
                    </label>
                    <input
                        id={id}
                        name={id}
                        type={type}
                        className="bg-transparent mt-auto w-full"
                        value={value}
                        onChange={onChange}
                        pattern={pattern}
                        min={min}
                        max={max}
                        maxLength={maxLength}
                        required={isRequired}
                    />
                </div>
            )}
        </div>
    );
};

export default Field;