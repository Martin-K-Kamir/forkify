import React, { useEffect, useState } from "react";
import FieldList from "../../components/FieldList.jsx";
import Icon from "../../components/Icon.jsx";
import { addAlert, removeAlert } from "../alert/alertSlice.js";
import { useDispatch } from "react-redux";
import Modal from "../../components/Modal.jsx";
import useModal from "../../hooks/useModal.jsx";
import SingleRecipe from "./SingleRecipe.jsx";
import { Link } from "react-router-dom";
import { wait } from "../../utilities.js";
import { useAddRecipeMutation } from "../user/userSlice.js";

const AddRecipeForm = () => {
    const dispatch = useDispatch();

    const {
        isModalVisible: isSuccessModalVisible,
        isModalRendered: isSuccessModalRendered,
        showModal: showSuccessModal,
        closeModal: closeSuccessModal,
    } = useModal();

    const {
        isModalVisible: isPreviewModalVisible,
        isModalRendered: isPreviewModalRendered,
        showModal: showPreviewModal,
        closeModal: closePreviewModal,
    } = useModal();

    const [addRecipe, { data, isLoading, isSuccess, isUninitialized }] =
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
    const [canSubmit, setCanSubmit] = useState(false);
    const [originalForm] = useState(form);
    const formRef = React.useRef(form);

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

    useEffect(() => {
        setCanSubmit(formRef.current.checkValidity() && !isLoading);
    }, [form]);

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

        try {
            await addRecipe(formatForm(form)).unwrap();

            showSuccessModal();
            await wait(200); // Wait for modal to render before resetting form
            setForm(originalForm);
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
        <div className="bg-zinc-800//above-sm radius-1 stack s-l max-w-xl mx-auto p-fluid-m-l//above-sm">
            <header>
                <h1 className="f-family-secondary f-size-fluid-4 f-weight-bold line-height-2">
                    Add Recipe
                </h1>
                <p className="mt-2xs text-zinc-200">
                    Add your own recipe to the most delicious recipe app on the
                    web!
                </p>
            </header>
            <form
                ref={formRef}
                className="form stack s-l"
                onSubmit={handleSubmit}
            >
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
                <div className="flex justify-content-center flex-direction-column//below-md gap-s mt-l">
                    <button
                        type="button"
                        className="bg-zinc-800 bg-zinc-900//above-sm text-zinc-050 text-center f-weight-medium f-size-1 line-height-1 radius-1 px-m py-s w-full//below-md"
                        disabled={!canSubmit}
                        onClick={showPreviewModal}
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

            {isPreviewModalRendered && (
                <Modal
                    isCloseRendered
                    isVisible={isPreviewModalVisible}
                    onClose={closePreviewModal}
                    className="max-w-xl mt-m bg-zinc-800 p-m py-l//below-sm p-3xs//above-sm"
                >
                    <SingleRecipe recipe={formatForm(form)} isPreview />
                </Modal>
            )}

            {isSuccessModalRendered && (
                <Modal
                    isCloseRendered
                    isVisible={isSuccessModalVisible}
                    onClose={closeSuccessModal}
                >
                    <div className="stack text-center//above-sm">
                        <h2 className="f-family-secondary f-size-fluid-3 f-weight-bold line-height-2">
                            Recipe Submitted
                        </h2>
                        <p className="text-zinc-200 text-balance">
                            Your recipe has been successfully submitted! Click
                            the go to recipe button to view it or add another
                            recipe.
                        </p>
                        <div className="flex justify-content-center gap-s w-full flex-direction-column//below-sm mt-l">
                            <button
                                className="bg-zinc-800 f-weight-medium f-size-1 line-height-1 radius-1 px-m py-s w-full//below-sm"
                                onClick={closeSuccessModal}
                            >
                                Go Back
                            </button>
                            <Link
                                to={data?.id}
                                className="bg-blue-700 text-zinc-050 text-center text-no-decoration f-weight-medium f-size-1 line-height-1 radius-1 px-m py-s w-full//below-sm"
                            >
                                Go to Recipe
                            </Link>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default AddRecipeForm;
