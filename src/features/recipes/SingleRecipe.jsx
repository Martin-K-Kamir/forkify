import Fraction from "fraction.js";
import Icon from "../../components/Icon.jsx";
import { capitalizeWords, wait } from "../../utilities.js";
import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    useRemoveRecipeMutation,
} from "../user/userSlice.js";
import useModal from "../../hooks/useModal.js";
import Modal from "../../components/Modal.jsx";
import { addAlert } from "../alert/alertSlice.js";
import RecipeActionButtons from "./RecipeActionButtons.jsx";
import Breadcrumbs from "../../components/Breadcrumbs.jsx";

const SingleRecipe = ({ recipe, isPreview }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { recipeId } = useParams();

    const {
        isModalVisible: isDeleteModalVisible,
        isModalRendered: isDeleteModalRendered,
        showModal: showDeleteModal,
        closeModal: closeDeleteModal,
    } = useModal();

    const [removeRecipe, { isLoading }] = useRemoveRecipeMutation();

    const [servings, setServings] = useState(0);
    const [prevServings, setPrevServings] = useState(0);
    const [ingredients, setIngredients] = useState(null);

    useEffect(() => {
        if (recipe) {
            setServings(recipe.servings);
            setIngredients(recipe.ingredients);
        }
    }, [recipe]);

    useEffect(() => {
        if (!ingredients) return;

        const newIngredients = ingredients.map(ingredient => {
            const newQuantity =
                (ingredient.quantity * servings) /
                (prevServings || recipe.servings);

            return {
                ...ingredient,
                quantity: newQuantity,
            };
        });

        setIngredients(newIngredients);
    }, [servings]);

    const handleIncreaseServingsClick = () => {
        setServings(prevServings => prevServings + 1);
        setPrevServings(servings);
    };

    const handleDecreaseServingsClick = () => {
        setServings(prevServings => {
            if (prevServings > 1) {
                return prevServings - 1;
            }
            return prevServings;
        });
        setPrevServings(servings);
    };

    const handleRemoveRecipeClick = async () => {
        try {
            await removeRecipe(recipeId).unwrap();
            closeDeleteModal();

            await wait(300);
            navigate(-1);

            dispatch(
                addAlert({
                    message: "Recipe deleted successfully",
                    isSuccess: true,
                    timeout: 5000,
                })
            );
        } catch (error) {
            dispatch(
                addAlert({
                    message: error.message,
                    isDanger: true,
                })
            );
        }
    };

    const renderedIngredients = (ingredients ?? recipe.ingredients).map(
        ({ quantity, unit, description }, i) => {
            let quantityString;

            if (quantity) {
                const fraction = new Fraction(quantity);
                quantityString = fraction.toFraction(true);
            }

            return (
                <li key={i} className="list-align-text">
                    {quantityString} {unit} {description}
                </li>
            );
        }
    );

    return (
        <div className="bg-zinc-800//above-sm radius-1 max-w-xl mx-auto p-fluid-m-l//above-sm pt-fluid-s-m//above-sm">
            {!isPreview && (
                <div className="mb-s">
                    <Breadcrumbs title={recipe.title} />
                </div>
            )}

            <div className="relative">
                <img
                    className="w-full aspect-ratio-16x9 object-cover radius-1"
                    src={recipe.image_url}
                    alt={recipe.title}
                />

                {!isPreview && (
                    <RecipeActionButtons
                        recipe={recipe}
                        onDeleteClick={showDeleteModal}
                        className="absolute top-3xs top-xs//above-sm right-3xs right-s//above-sm"
                    />
                )}
            </div>

            <div className="stack s-l mt-fluid-s-m">
                <header>
                    <h1 className="f-family-secondary f-size-fluid-4 f-weight-medium line-height-2">
                        {capitalizeWords(recipe.title)}
                    </h1>
                    <div className="flex flex-wrap align-items-center gap-2xs text-zinc-300 mt-2xs">
                        <div className="flex align-items-center f-weight-medium mr-xs">
                            <Icon
                                type="person"
                                className="f-size-2 mr-3xs"
                                fill
                            />
                            <p>by {recipe.publisher}</p>
                        </div>
                        <div className="flex align-items-center f-weight-medium mr-xs">
                            <Icon type="schedule" className="f-size-2 mr-3xs" />
                            <p>{recipe.cooking_time} minutes</p>
                        </div>
                        <div className="flex align-items-center f-weight-medium">
                            <Icon
                                type="group"
                                fill
                                className="f-size-2 mr-3xs"
                            />
                            <p>{servings || recipe.servings} servings</p>
                            <div className="flex align-items-center gap-3xs f-size-2 ml-xs">
                                <button
                                    onClick={handleDecreaseServingsClick}
                                    className="flex justify-content-center align-items-center text-blue-500"
                                    aria-label="Decrease the number of servings"
                                >
                                    <Icon type="downCircle" />
                                </button>
                                <button
                                    onClick={handleIncreaseServingsClick}
                                    className="flex justify-content-center align-items-center text-blue-500"
                                    aria-label="Increase the number of servings"
                                >
                                    <Icon type="upCircle" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>
                <section>
                    <h2 className="f-family-secondary f-size-fluid-3 f-weight-medium line-height-2">
                        Recipe ingredients
                    </h2>
                    <ul className="list-style-inside mt-2xs stack s-3xs text-zinc-300">
                        {renderedIngredients}
                    </ul>
                </section>
                <section>
                    <h2 className="f-family-secondary f-size-fluid-3 f-weight-medium line-height-2">
                        How to cook it
                    </h2>
                    <p className="mt-2xs text-zinc-300">
                        This recipe was carefully designed and tested by{" "}
                        {recipe.publisher}. Please check out directions at their
                        website.
                    </p>
                    <a
                        className="inline-block bg-blue-700 text-zinc-050 text-no-decoration text-center f-weight-medium f-size-1 line-height-1 radius-1 px-m py-s mt-m w-full//below-sm"
                        href={recipe.source_url}
                        target="_blank"
                    >
                        Click here for directions
                    </a>
                </section>
            </div>

            {isDeleteModalRendered && (
                <Modal
                    isCloseRendered
                    isVisible={isDeleteModalVisible}
                    onClose={closeDeleteModal}
                >
                    <div className="stack text-center//above-sm">
                        <h2 className="f-family-secondary f-size-fluid-3 f-weight-medium line-height-2">
                            Delete Recipe
                        </h2>
                        <p className="text-zinc-200 text-balance">
                            Are you sure you want to delete this recipe? This
                            action cannot be undone.
                        </p>
                        <div className="flex justify-content-center gap-s w-full flex-direction-column//below-sm mt-l">
                            <button
                                className="bg-zinc-800 f-weight-medium f-size-1 line-height-1 radius-1 px-m py-s w-full//below-sm"
                                onClick={closeDeleteModal}
                            >
                                Go Back
                            </button>
                            <button
                                className="bg-red-800 f-weight-medium f-size-1 line-height-1 radius-1 px-m py-s w-full//below-sm"
                                onClick={handleRemoveRecipeClick}
                            >
                                {isLoading ? (
                                    <Icon
                                        type="progressActivity"
                                        className="animation-spin f-size-1"
                                    />
                                ) : (
                                    "Delete Recipe"
                                )}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default SingleRecipe;
