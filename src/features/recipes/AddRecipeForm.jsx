import { useState } from "react";
import Icon from "../../components/Icon.jsx";

const FormField = ({id, value, label, isRequired, inputType, pattern, min, max, handleChange }) => {

    const handleClick = e => {
        e.target.querySelector("input")?.focus();
    };

    return (
        <div
            className="label-w-input bg-zinc-900 px-s py-xs radius-1 w-full cursor-text"
            onClick={handleClick}
        >
            <div className="relative flex h-full w-full line-height-1">
                <label htmlFor={name} className="cursor-text">
                    {label}
                    {isRequired && "*"}
                </label>
                <input
                    id={id}
                    name={id}
                    type={inputType}
                    className="bg-transparent mt-auto w-full"
                    value={value}
                    onChange={handleChange}
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
                isRequired: true,
                inputType: "text",
                pattern:
                    "^(?=.{3,50}$)[A-Za-z]+(&[A-Za-z]+)*( [A-Za-z]+)*( [A-Za-z]+)* *(?:[0-9]|!)?$",
                value: "",
            },
            {
                id: "form-author",
                label: "Author",
                isRequired: true,
                inputType: "text",
                pattern:
                    "^[\\p{L}\\s&]{2,25}$|^[\\p{L}\\s&]{1,25}(\\s[\\p{L}\\s&]{1,25})*$",
                value: "",
            },
            {
                id: "form-prep-time",
                label: "Prep Time (minutes)",
                isRequired: true,
                inputType: "number",
                pattern: "^(?!0\\d{2,})([0-9]{3,600})$",
                min: 3,
                max: 600,
                value: "",
            },
            {
                id: "form-servings",
                label: "Servings",
                isRequired: true,
                inputType: "number",
                pattern: "^(?!0\\d{2,})([0-9]{1,100})$",
                min: 1,
                max: 100,
                value: "",
            },
            {
                id: "form-link",
                label: "Link to Recipe",
                isRequired: false,
                inputType: "url",
                pattern: "https?://.+",
                value: "",
            },
        ],
        images: [
            {
                id: "form-image-1",
                label: "Image Link 1",
                isRequired: true,
                order: 1,
                type: "image",
                inputType: "url",
                pattern: "https?://.+",
                value: "",
            },
        ],
        ingredients: [{
            id: "form-ingredient-1",
            order: 1,
            type: "ingredient",
            quantity: "",
            unit: "",
            description: "",
        }],
    });

    const handleChange = payload => {
        const id = payload.id;
        const section = payload.section;
        const value = payload.value;

        setForm(prevForm => {
            const updatedFields = prevForm[section].map(field => {
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
                [section]: updatedFields,
            };
        });
    };

    const handleAddField = payload => {
        const type = payload.type;
        const section = payload.section;

        setForm(prevForm => {
            const fields = prevForm[section].filter(field =>
                field.id.includes(type)
            );

            const lastField = fields.at(-1);

            const newField = {
                ...lastField,
                id: `form-${type}-${lastField.order + 1}`,
                label: `${lastField.label.replace(/\d+/, "")} ${
                    lastField.order + 1
                }`,
                order: lastField.order + 1,
            };

            return {
                ...prevForm,
                [section]: [...prevForm[section], newField],
            };
        });
    };

    const handleRemoveField = payload => {
        const id = payload.id;
        const type = payload.type;
        const section = payload.section;

        setForm(prevForm => {
            const fields = prevForm[section].filter(field =>
                field.id.includes(type)
            );

            const filteredFields = fields.filter(field => field.id !== id);

            const updatedFields = filteredFields.map((field, i) => {
                return {
                    ...field,
                    id: `form-${type}-${i + 1}`,
                    label: `${field.label.replace(/\d+/, "")} ${i + 1}`,
                    order: i + 1,
                };
            });

            return {
                ...prevForm,
                [section]: updatedFields,
            };
        });
    };

    const renderedDetails = form.details.map(field => {
        return (
            <FormField
                key={field.id}
                handleChange={e =>
                    handleChange({
                        id: field.id,
                        section: "details",
                        value: e.target.value,
                    })
                }
                {...field}
            />
        );
    });

    const renderedImages = form.images.map((field, i, arr) => {
        const isFirstIndex = i === 0;
        const isLastIndex = i === arr.length - 1;
        const isLimitReached = arr.length === 5;

        return (
            <div key={field.id}>
                <div className="flex align-items-center gap-xs">
                    <FormField
                        handleChange={e =>
                            handleChange({
                                id: field.id,
                                section: "images",
                                value: e.target.value,
                            })
                        }
                        {...field}
                    />
                    {!isFirstIndex && (
                        <button
                            className="bg-red-700 radius-1 flex-shrink-0 p-2xs f-weight-medium flex align-items-center gap-3xs f-size--1 line-height-1"
                            onClick={() =>
                                handleRemoveField({
                                    id: field.id,
                                    type: "image",
                                    section: "images",
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
                        onClick={() =>
                            handleAddField({ type: "image", section: "images" })
                        }
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
        return (
            <div key={field.id}>
                <div className="flex align-items-center gap-xs">
                    <FormField
                        id={`${field.id}-quantity`}
                        label="Quantity"

                </div>
            </div>
        )
    })

    return (
        <div className="bg-zinc-800 radius-1 stack s-l max-w-xl mx-auto p-fluid-m-l pb-fluid-l-xl">
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
                </section>
            </form>
        </div>
    );
};

export default AddRecipeForm;
