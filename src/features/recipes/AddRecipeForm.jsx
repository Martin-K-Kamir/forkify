import React, { useState } from "react";
import Icon from "../../components/Icon.jsx";
import classNames from "classnames";
import FieldList from "../../components/FieldList.jsx";
import Field from "../../components/Field.jsx";

const AddRecipeForm = () => {
    const [form, setForm] = useState({
        details: [
            {
                id: "form-title",
                label: "Recipe Title",
                type: "text",
                isRequired: true,
                pattern:
                    "^(?=.{3,50}$)[A-Za-z]+(&[A-Za-z]+)*( [A-Za-z]+)*( [A-Za-z]+)* *(?:[0-9]|!)?$",
                value: "",
            },
            {
                id: "form-author",
                label: "Author",
                type: "text",
                isRequired: true,
                pattern:
                    "^[\\p{L}\\s&]{2,25}$|^[\\p{L}\\s&]{1,25}(\\s[\\p{L}\\s&]{1,25})*$",
                value: "",
            },
            {
                id: "form-prep-time",
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
                        maxLength: 7,
                    },
                    {
                        id: "form-ingredient-description-1",
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
            const regexRemoveNumber = /\d+$/;
            const firstField = prevForm[key][0];
            const name = firstField.id.replace(regexRemoveNumber, "");
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
                                    subField.id.replace(regexRemoveNumber, "") +
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
            const regexRemoveNumber = /\d+$/;
            const name = id.replace(regexRemoveNumber, "");
            const filteredFields = prevForm[key].filter(
                field => field.id !== id
            );

            const updatedFields = filteredFields.map((field, i) => {
                if (field.subFields) {
                    return {
                        ...field,
                        id: name + (i + 1),
                        subFields: field.subFields.map(subField => {
                            const id = subField.id.replace(regexRemoveNumber, "");
                            const label = subField.label.replace(regexRemoveNumber, "");

                            return {
                                ...subField,
                                id: id + (i + 1),
                                label: label === "Description " && i !== 0 ? label + (i + 1) : label,
                            };
                        }),
                    };
                }

                return {
                    ...field,
                    id: name + (i + 1),
                    ...(i !== 0 && {label: field.label.replace(regexRemoveNumber, "") + (i + 1)}),
                };
            });

            return {
                ...prevForm,
                [key]: updatedFields,
            };
        });
    };

    const convertArrayToObject = array => {
        return array.reduce((obj, item) => {
            return {
                ...obj,
                [item.id]: item.value,
            };
        }, {});
    }

    const handleSubmit = e => {
        e.preventDefault();

        const howItSholdLook = {
            "publisher": "Closet Cooking",
            "ingredients": [
                {
                    "quantity": 1,
                    "unit": "",
                    "description": "medium head cauliflower cut into florets"
                },
                {
                    "quantity": 1,
                    "unit": "",
                    "description": "egg"
                },
                {
                    "quantity": 0.5,
                    "unit": "cup",
                    "description": "mozzarella shredded"
                },
                {
                    "quantity": 1,
                    "unit": "tsp",
                    "description": "oregano or italian seasoning blend"
                },
                {
                    "quantity": null,
                    "unit": "",
                    "description": "Salt and pepper to taste"
                },
                {
                    "quantity": 1,
                    "unit": "cup",
                    "description": "chicken cooked and shredded"
                },
                {
                    "quantity": 0.5,
                    "unit": "cup",
                    "description": "barbecue sauce"
                },
                {
                    "quantity": 0.75,
                    "unit": "cup",
                    "description": "mozzarella shredded"
                },
                {
                    "quantity": null,
                    "unit": "",
                    "description": "Red onion to taste thinly sliced"
                },
                {
                    "quantity": null,
                    "unit": "",
                    "description": "Fresh cilantro to taste"
                }
            ],
            "source_url": "http://feedproxy.google.com/~r/ClosetCooking/~3/xvkmVGnlXNQ/cauliflower-pizza-crust-with-bbq.html",
            "image_url": "http://forkify-api.herokuapp.com/images/BBQChickenPizzawithCauliflowerCrust5004699695624ce.jpg",
            "title": "Cauliflower Pizza Crust (with BBQ Chicken Pizza)",
            "servings": 4,
            "cooking_time": 75,
            "id": "5ed6604591c37cdc054bcd09"
        }

        const formattedForm = {}
    }

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
                <div className="flex justify-content-center flex-direction-column//below-md gap-s mt-xl">
                    <button
                        type="button"
                        className="bg-zinc-800 bg-zinc-900//above-sm text-zinc-050 text-center f-weight-medium f-size-1 line-height-1 radius-1 px-m py-xs w-full//below-md"
                    >
                        Preview Of Recipe
                    </button>
                    <button
                        className="bg-blue-700 text-zinc-050 text-center f-weight-medium f-size-1 line-height-1 radius-1 px-m py-xs w-full//below-md"
                    >
                        Submit Recipe
                    </button>
                </div>

            </form>
        </div>
    );
};

export default AddRecipeForm;
