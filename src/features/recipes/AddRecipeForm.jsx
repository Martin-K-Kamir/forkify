import React, { useEffect, useState } from "react";
import FieldList from "../../components/FieldList.jsx";
import { useAddRecipeMutation } from "./recipiesSlice.js";
import Icon from "../../components/Icon.jsx";
import { addAlert, removeAlert } from "../alert/alertSlice.js";
import { useDispatch } from "react-redux";
import Modal from "../../components/Modal.jsx";

const AddRecipeForm = () => {
    const dispatch = useDispatch();
    const [addRecipe, { isLoading, isSuccess, isUninitialized }] =
        useAddRecipeMutation();

    const [form, setForm] = useState({
        details: [
            {
                id: "form-title",
                label: "Recipe Title",
                type: "text",
                isRequired: true,
                pattern: "[\\s\\S]{4,50}",
                value: "",
            },
            {
                id: "form-publisher",
                label: "Publisher",
                type: "text",
                isRequired: true,
                pattern: "^[\\p{L}\\s]{4,25}$",
                value: "",
            },
            {
                id: "form-cooking-time",
                label: "Prep Time (minutes)",
                type: "number",
                isRequired: true,
                pattern: "^(?!0\\d{2,})([0-9]{3,600})$",
                min: 3,
                max: 600,
                value: "",
            },
            {
                id: "form-servings",
                label: "Servings",
                type: "number",
                isRequired: true,
                pattern: "^(?!0\\d{2,})([0-9]{1,100})$",
                min: 1,
                max: 100,
                value: "",
            },
            {
                id: "form-source-url",
                label: "Link to Recipe",
                isRequired: true,
                type: "url",
                pattern: "https?://.+",
                value: "",
            },
        ],
        images: [
            {
                id: "form-image-url-1",
                label: "Image URL",
                type: "url",
                isRequired: true,
                pattern: "https?://.+",
                value: "",
            },
        ],
        ingredients: [
            {
                id: "form-ingredient-1",
                subFields: [
                    {
                        id: "form-quantity-1",
                        label: "Quantity",
                        isRequired: false,
                        type: "number",
                        value: "",
                    },
                    {
                        id: "form-unit-1",
                        label: "Unit",
                        isRequired: false,
                        type: "text",
                        value: "",
                        maxLength: 7,
                    },
                    {
                        id: "form-description-1",
                        label: "Description",
                        type: "text",
                        isRequired: true,
                        value: "",
                        maxLength: 50,
                    },
                ],
            },
        ],
        instructions: [
            {
                id: "form-instruction-1",
                label: "Instruction",
                type: "textarea",
                isRequired: false,
                value: "",
            },
        ],
    });
    const [originalForm] = useState(form);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    useEffect(() => {
        let timer;
        const message =
            "The server is taking longer than usual to respond. Please be patient.";
        if (isLoading && !isUninitialized) {
            timer = setTimeout(() => {
                dispatch(
                    addAlert({
                        message,
                        isWarning: true,
                        timeout: 5_000,
                    })
                );
            }, 5_000);
        } else if (isSuccess) {
            dispatch(removeAlert(message));
        }

        return () => clearTimeout(timer);
    }, [isLoading, isSuccess]);

    const formatId = (id, replaceNumber) => {
        id = id.replace(/^form-/g, "");
        if (replaceNumber) {
            id = id.replace(/-\d+$/g, "");
        }
        id = id.replace(/-/g, "_");

        return id;
    };

    const formatValue = value => {
        if (value === "") {
            return "";
        }

        return /^[0-9]+$/.test(value) ? Number(value) : value;
    };

    const formatFields = (fields, replaceNumber) => {
        return fields.reduce((acc, field) => {
            const key = formatId(field.id, replaceNumber);
            const value = formatValue(field.value);

            if (field.subFields) {
                return {
                    ...acc,
                    [key]: formatFields(field.subFields, true),
                };
            }

            return {
                ...acc,
                [key]: value,
            };
        }, {});
    };

    const formatForm = form => {
        return Object.keys(form).reduce((acc, key) => {
            const formattedFields = formatFields(form[key]);
            const fieldValues = Object.values(formattedFields);

            if (key === "details") {
                return {
                    ...acc,
                    ...formattedFields,
                };
            }

            if (key === "images") {
                return {
                    ...acc,
                    image_url: fieldValues[0], // The API requires image_url
                    [key]: fieldValues,
                };
            }

            if (fieldValues.length === 1) {
                return {
                    ...acc,
                    [key]: Boolean(fieldValues[0]) ? [fieldValues[0]] : null,
                };
            }

            return {
                ...acc,
                [key]: fieldValues,
            };
        }, {});
    };

    const handleChange = payload => {
        const { id, path, value } = payload;
        const key = Object.keys(form).find(key => {
            return form[key] === path;
        });

        setForm(prevForm => {
            const updatedFields = prevForm[key].map(field => {
                if (field.id === id) {
                    return {
                        ...field,
                        value,
                    };
                } else if (field.subFields) {
                    const updatedSubFields = field.subFields.map(subField => {
                        if (subField.id === id) {
                            return {
                                ...subField,
                                value,
                            };
                        }
                        return subField;
                    });

                    return {
                        ...field,
                        subFields: updatedSubFields,
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
        const { path } = payload;

        const key = Object.keys(form).find(key => {
            return form[key] === path;
        });

        setForm(prevForm => {
            const regexNumber = /\d+$/;
            const firstField = prevForm[key][0];
            const name = firstField.id.replace(regexNumber, "");
            const number = prevForm[key].length + 1;

            let updatedFields;
            if (firstField.subFields) {
                updatedFields = [
                    ...prevForm[key],
                    {
                        id: name + number,
                        subFields: firstField.subFields.map(subField => {
                            return {
                                ...subField,
                                id:
                                    subField.id.replace(regexNumber, "") +
                                    number,
                                value: "",
                                ...(subField.label === "Description" && {
                                    label: subField.label + " " + number,
                                }),
                            };
                        }),
                    },
                ];
            } else {
                updatedFields = [
                    ...prevForm[key],
                    {
                        ...firstField,
                        id: name + number,
                        label: firstField.label + " " + number,
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
        const { id, path } = payload;

        const key = Object.keys(form).find(key => {
            return form[key] === path;
        });

        setForm(prevForm => {
            const regexNumber = /\d+$/;
            const name = id.replace(regexNumber, "");
            const filteredFields = prevForm[key].filter(
                field => field.id !== id
            );

            const updatedFields = filteredFields.map((field, i) => {
                if (field.subFields) {
                    return {
                        ...field,
                        id: name + (i + 1),
                        subFields: field.subFields.map(subField => {
                            const id = subField.id.replace(regexNumber, "");
                            const label = subField.label.replace(
                                regexNumber,
                                ""
                            );

                            return {
                                ...subField,
                                id: id + (i + 1),
                                label:
                                    label === "Description " && i !== 0
                                        ? label + (i + 1)
                                        : label,
                            };
                        }),
                    };
                }

                return {
                    ...field,
                    id: name + (i + 1),
                    ...(i !== 0 && {
                        label: field.label.replace(regexNumber, "") + (i + 1),
                    }),
                };
            });

            return {
                ...prevForm,
                [key]: updatedFields,
            };
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        console.log({ form: formatForm(form) });

        try {
            await addRecipe(formatForm(form)).unwrap();
            console.log({ originalForm });
            setForm(originalForm);
            setAgreedToTerms(false);
        } catch (err) {
            console.error(err);

            dispatch(
                addAlert({
                    message: err.message,
                    isDanger: true,
                    timeout: 5000,
                })
            );
        }
    };

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
            <form className="form stack s-l" onSubmit={handleSubmit}>
                <section>
                    <h2 className="f-family-secondary f-size-fluid-3 f-weight-bold line-height-2">
                        Details
                    </h2>
                    <div className="form-details grid gap-m mt-s">
                        <FieldList
                            fields={form.details}
                            onChange={handleChange}
                        />
                    </div>
                </section>
                <section>
                    <h2 className="f-family-secondary f-size-fluid-3 f-weight-bold line-height-2">
                        Images
                    </h2>
                    <div className="grid gap-m mt-s">
                        <FieldList
                            fields={form.images}
                            onChange={handleChange}
                            options={{
                                handleAddField,
                                handleRemoveField,
                                addFieldText: "Add Image",
                            }}
                        />
                    </div>
                </section>
                <section>
                    <h2 className="f-family-secondary f-size-fluid-3 f-weight-bold line-height-2">
                        Ingredients
                    </h2>
                    <div className="grid gap-m mt-s">
                        <FieldList
                            fields={form.ingredients}
                            onChange={handleChange}
                            options={{
                                handleAddField,
                                handleRemoveField,
                                addFieldText: "Add Ingredient",
                                limit: 25,
                            }}
                        />
                    </div>
                </section>
                <section>
                    <h2 className="f-family-secondary f-size-fluid-3 f-weight-bold line-height-2">
                        How to Cook It
                    </h2>
                    <div className="grid gap-m mt-s">
                        <FieldList
                            fields={form.instructions}
                            onChange={handleChange}
                            options={{
                                handleAddField,
                                handleRemoveField,
                                addFieldText: "Add Instruction",
                            }}
                        />
                    </div>
                </section>
                <div className="flex align-items-start gap-2xs">
                    <input
                        type="checkbox"
                        id="form-agree"
                        style={{ transform: "translateY(3px)" }}
                        checked={agreedToTerms}
                        onChange={e => setAgreedToTerms(e.target.checked)}
                        required={true}
                    />
                    <label
                        htmlFor="form-agree"
                        className="f-size--1 text-zinc-300"
                    >
                        I understand that the API is only for testing purposes
                        and multiple images and instructions are not going to be
                        submitted. Also i just wanted to add checkbox and long
                        "terms" text to the form.
                    </label>
                </div>
                <div className="flex justify-content-center flex-direction-column//below-md gap-s mt-l">
                    <button
                        type="button"
                        className="bg-zinc-800 bg-zinc-900//above-sm text-zinc-050 text-center f-weight-medium f-size-1 line-height-1 radius-1 px-m py-s w-full//below-md"
                        disabled={isLoading}
                    >
                        Preview Recipe
                    </button>
                    <button className="bg-blue-700 text-zinc-050 text-center f-weight-medium f-size-1 line-height-1 radius-1 px-m py-s w-full//below-md">
                        {isLoading ? (
                            <Icon
                                type="progressActivity"
                                className="animation-spin f-size-1"
                            />
                        ) : (
                            "Submit Recipe"
                        )}
                    </button>
                </div>
            </form>

            <Modal transition showClose>
                <div className="stack">
                    <h2 className="f-family-secondary f-size-fluid-3 f-weight-bold line-height-2">
                        Recipe Submitted
                    </h2>
                    <p className="text-zinc-200">
                        Your recipe has been successfully submitted! Click the go to recipe button to view it. Or add another recipe.
                    </p>
                    <div className="flex gap-m w-full">
                        <button
                            className="bg-zinc-800 f-weight-medium f-size-1 line-height-1 radius-1 px-m py-s w-full//below-sm">
                            Add New Recipe
                        </button>
                        <button
                            className="bg-blue-700 f-weight-medium f-size-1 line-height-1 radius-1 px-m py-s w-full//below-sm">
                            Go to Recipe
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AddRecipeForm;
