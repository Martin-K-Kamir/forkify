import { useState } from "react";
import Icon from "../../components/Icon.jsx";
import classNames from "classnames";

const FormField = ({
    id,
    value,
    label,
    isRequired = true,
    type,
    pattern,
    min,
    max,
    onChange,
    className,
}) => {
    const handleClick = e => {
        e.target.querySelector("input")?.focus();
    };

    const wrapperClasses = classNames(
        "field bg-zinc-800 bg-zinc-900//above-sm px-s py-xs radius-1 w-full cursor-text",
        className
    );

    return (
        <div className={wrapperClasses} onClick={handleClick}>
            <div className="relative flex h-full w-full line-height-1">
                <label htmlFor={name} className="cursor-text">
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
                    required={isRequired}
                />
            </div>
        </div>
    );
};
const AddRecipeForm = () => {
    const [form, setForm] = useState({
        details: [
            {
                id: "form-title",
                label: "Recipe Title",
                type: "text",
                pattern:
                    "^(?=.{3,50}$)[A-Za-z]+(&[A-Za-z]+)*( [A-Za-z]+)*( [A-Za-z]+)* *(?:[0-9]|!)?$",
                value: "",
            },
            {
                id: "form-author",
                label: "Author",
                type: "text",
                pattern:
                    "^[\\p{L}\\s&]{2,25}$|^[\\p{L}\\s&]{1,25}(\\s[\\p{L}\\s&]{1,25})*$",
                value: "",
            },
            {
                id: "form-prep-time",
                label: "Prep Time (minutes)",
                type: "number",
                pattern: "^(?!0\\d{2,})([0-9]{3,600})$",
                min: 3,
                max: 600,
                value: "",
            },
            {
                id: "form-servings",
                label: "Servings",
                type: "number",
                pattern: "^(?!0\\d{2,})([0-9]{1,100})$",
                min: 1,
                max: 100,
                value: "",
            },
            {
                id: "form-link",
                label: "Link to Recipe",
                isRequired: false,
                type: "url",
                pattern: "https?://.+",
                value: "",
            },
        ],
        images: [
            {
                id: "form-image-1",
                type: "url",
                pattern: "https?://.+",
                value: "",
            },
        ],
        ingredients: [
            {
                id: "form-ingredient-1",
                subFields: [
                    {
                        id: "form-ingredient-quantity-1",
                        label: "Quantity",
                        isRequired: false,
                        type: "number",
                        value: "",
                    },
                    {
                        id: "form-ingredient-unit-1",
                        label: "Unit",
                        isRequired: false,
                        type: "text",
                        value: "",
                    },
                    {
                        id: "form-ingredient-description-1",
                        label: "Description",
                        type: "text",
                        value: "",
                    },
                ],
            },
        ],
    });

    const handleChange = payload => {
        const { id, key, value } = payload;

        setForm(prevForm => {
            const updatedFields = prevForm[key].map(field => {
                if (field.id === id) {
                    return {
                        ...field,
                        value,
                    };
                }

                return field;
            });

            return {
                ...prevForm,
                [key]: updatedFields,
            };
        });
    };

    const handleAddField = payload => {
        const { key } = payload;

        setForm(prevForm => {
            const firstField = prevForm[key][0];
            const name = firstField.id.replace(/form-(.+)-\d+/, "$1");
            const number = prevForm[key].length + 1;

            let updatedFields;

            if (firstField.subFields) {
                updatedFields = [
                    ...prevForm[key],
                    {
                        id: `form-${name}-${number}`,
                        subFields: firstField.subFields.map(subField => {
                            return {
                                ...subField,
                                id: `form-${name}-${number}-${subField.id.replace(
                                    /form-(.+)-\d+-/,
                                    "$1-"
                                )}`,
                                value: "",
                            };
                        }),
                    },
                ];
            } else {
                updatedFields = [
                    ...prevForm[key],
                    {
                        ...firstField,
                        id: `form-${name}-${number}`,
                        value: "",
                    },
                ];
            }

            return {
                ...prevForm,
                [key]: updatedFields,
            };
        });
    };

    const handleRemoveField = payload => {
        const { id, key } = payload;

        setForm(prevForm => {
            const name = id.replace(/form-(.+)-\d+/, "$1");
            const filteredFields = prevForm[key].filter(
                field => field.id !== id
            );

            const updatedFields = filteredFields.map((field, i) => {
                return {
                    ...field,
                    id: `form-${name}-${i + 1}`,
                };
            });

            return {
                ...prevForm,
                [key]: updatedFields,
            };
        });
    };

    const renderedDetails = form.details.map(field => {
        return (
            <FormField
                key={field.id}
                {...field}
                onChange={e =>
                    handleChange({
                        id: field.id,
                        key: "details",
                        value: e.target.value,
                    })
                }
            />
        );
    });

    const renderedImages = form.images.map((field, i, arr) => {
        const isFirstIndex = i === 0;
        const isLastIndex = i === arr.length - 1;
        const isLimitReached = arr.length === 5;

        return (
            <div key={field.id}>
                <div className="form-row grid align-items-center gap-xs">
                    <FormField
                        {...field}
                        label="Image URL"
                        onChange={e =>
                            handleChange({
                                id: field.id,
                                key: "images",
                                value: e.target.value,
                            })
                        }
                    />
                    {!isFirstIndex && (
                        <button
                            className="bg-red-700 radius-1 flex-shrink-0 p-2xs f-weight-medium flex align-items-center gap-3xs f-size--1 line-height-1"
                            onClick={() =>
                                handleRemoveField({
                                    id: field.id,
                                    key: "images",
                                })
                            }
                            type="button"
                        >
                            <Icon className="f-size-2" type="cancel" />
                        </button>
                    )}
                </div>
                {!isLimitReached && isLastIndex && (
                    <button
                        className="bg-blue-700 radius-1 px-s py-xs f-weight-medium flex align-items-center gap-3xs f-size--1 line-height-1 mt-xs"
                        onClick={() => handleAddField({ key: "images" })}
                        type="button"
                    >
                        <Icon className="f-size-1" type="addCircle" />
                        Add Image
                    </button>
                )}
            </div>
        );
    });

    const renderedIngredients = form.ingredients.map((field, i, arr) => {
        const isFirstIndex = i === 0;
        const isLastIndex = i === arr.length - 1;
        const isLimitReached = arr.length === 20;

        return (
            <div key={field.id}>
                <div className="form-row grid align-items-center gap-xs">
                    {field.subFields.map(subField => (
                        <FormField
                            key={subField.id}
                            {...subField}
                            onChange={e =>
                                handleChange({
                                    id: subField.id,
                                    key: "ingredients",
                                    value: e.target.value,
                                })
                            }
                        />
                    ))}
                    {!isFirstIndex && (
                        <button
                            className="bg-red-700 radius-1 flex-shrink-0 p-2xs f-weight-medium flex align-items-center gap-3xs f-size--1 line-height-1"
                            onClick={() =>
                                handleRemoveField({
                                    id: field.id,
                                    key: "ingredients",
                                })
                            }
                            type="button"
                        >
                            <Icon className="f-size-2" type="cancel" />
                        </button>
                    )}
                </div>
                {!isLimitReached && isLastIndex && (
                    <button
                        className="bg-blue-700 radius-1 px-s py-xs f-weight-medium flex align-items-center gap-3xs f-size--1 line-height-1 mt-xs"
                        onClick={() => handleAddField({ key: "ingredients" })}
                        type="button"
                    >
                        <Icon className="f-size-1" type="addCircle" />
                        Add Ingredient
                    </button>
                )}
            </div>
        );
    });

    return (
        <div className="bg-zinc-800//above-sm radius-1 stack s-l max-w-xl mx-auto p-fluid-m-l//above-sm pb-fluid-l-xl//above-sm">
            <header>
                <h1 className="f-family-secondary f-size-fluid-4 f-weight-bold line-height-2">
                    Add Recipe
                </h1>
                <p className="mt-2xs">
                    Add your own recipe to the most delicious recipe app on the
                    web!
                </p>
            </header>
            <form className="form stack s-l">
                <section>
                    <h2 className="f-family-secondary f-size-fluid-3 f-weight-bold line-height-2">
                        Details
                    </h2>
                    <div className="form-details grid gap-m mt-s">
                        {renderedDetails}
                    </div>
                </section>
                <section>
                    <h2 className="f-family-secondary f-size-fluid-3 f-weight-bold line-height-2">
                        Images
                    </h2>
                    <div className="grid gap-m mt-s">{renderedImages}</div>
                </section>
                <section>
                    <h2 className="f-family-secondary f-size-fluid-3 f-weight-bold line-height-2">
                        Ingredients
                    </h2>
                    <div className="grid gap-m mt-s">{renderedIngredients}</div>
                </section>
            </form>
        </div>
    );
};

export default AddRecipeForm;
