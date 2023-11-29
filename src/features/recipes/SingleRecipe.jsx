import Fraction from "fraction.js";
import Icon from "../../components/Icon.jsx";
import { capitalizeWords, wait } from "../../utilities.js";
import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRemoveRecipeMutation } from "../user/userSlice.js";
import useModal from "../../hooks/useModal.js";
import Modal from "../../components/Modal.jsx";
import { addAlert } from "../alert/alertSlice.js";
import RecipeActionButtons from "./RecipeActionButtons.jsx";
import Breadcrumbs from "../../components/Breadcrumbs.jsx";
import Button from "../../components/Button.jsx";
import IconButton from "../../components/IconButton.jsx";
import classnames from "classnames";
import imagePlaceholder from "../../assets/images/image-placeholder.webp";
import { ALERT_TIMEOUT_LONG } from "../../app/config.js";

const SingleRecipe = ({ recipe, isPreview, backgroundClassName }) => {
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

    const [servings, setServings] = useState(recipe.servings);
    const [prevServings, setPrevServings] = useState(0);
    const [ingredients, setIngredients] = useState(recipe.ingredients);
    const [isImagePlaceholder, setIsImagePlaceholder] = useState(false);
    const [imageSrc, setImageSrc] = useState(recipe?.image_url);

    const classes = classnames(
        "radius-1 max-w-xl mx-auto p-fluid-m-l//above-sm",
        {
            "pt-fluid-s-m//above-sm": !isPreview,
            "bg-gray-050//above-sm bg-zinc-800//dark//above-sm":
                !backgroundClassName,
        },
        backgroundClassName
    );

    useEffect(() => {
        const img = new Image();
        img.src = recipe?.image_url;
        img.onerror = () => {
            setImageSrc(imagePlaceholder);
            setIsImagePlaceholder(true);

            if (isPreview) {
                dispatch(
                    addAlert({
                        message:
                            "The image url is invalid. Please try another one.",
                        isDanger: true,
                    })
                );
            }
        };
    }, [recipe?.image_url]);

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
                    timeout: ALERT_TIMEOUT_LONG,
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
        <div className={classes}>
            {!isPreview && (
                <div className="mb-s none//print">
                    <Breadcrumbs title={recipe.title} />
                </div>
            )}

            <div className="relative">
                <img
                    className="w-full aspect-ratio-16x9 object-cover radius-1"
                    src={imageSrc}
                    alt={!isImagePlaceholder ? recipe?.title : undefined}
                    aria-hidden={isImagePlaceholder}
                />
            </div>

            <div className="stack s-l mt-m">
                <header>
                    <h1 className="f-family-secondary f-size-fluid-3 f-size-fluid-4//above-sm f-weight-medium line-height-2">
                        {capitalizeWords(recipe.title)}
                    </h1>

                    {!isPreview && (
                        <RecipeActionButtons
                            recipe={recipe}
                            onDeleteClick={showDeleteModal}
                            className="flex align-items-center gap-2xs mt-xs none//print"
                        />
                    )}

                    <div className="flex flex-wrap align-items-center gap-2xs text-gray-600 text-zinc-300//dark mt-s">
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
                            <div className="flex align-items-center gap-2xs f-size-2 ml-xs none//print">
                                <IconButton
                                    disableRipple
                                    variant="text"
                                    srOnly="Decrease the number of servings"
                                    title="Decrease the number of servings"
                                    onClick={handleDecreaseServingsClick}
                                    hover="absolute"
                                >
                                    <Icon
                                        type="downCircle"
                                        className="f-size-2"
                                    />
                                </IconButton>
                                <IconButton
                                    disableRipple
                                    variant="text"
                                    srOnly="Increase the number of servings"
                                    title="Increase the number of servings"
                                    onClick={handleIncreaseServingsClick}
                                    hover="absolute"
                                >
                                    <Icon
                                        type="upCircle"
                                        className="f-size-2"
                                    />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </header>
                <section>
                    <h2 className="f-family-secondary f-size-fluid-3 f-weight-medium line-height-2">
                        Recipe ingredients
                    </h2>
                    <ul className="list-style-inside mt-2xs stack s-3xs text-gray-600 text-zinc-300//dark">
                        {renderedIngredients}
                    </ul>
                </section>
                <section>
                    <h2 className="f-family-secondary f-size-fluid-3 f-weight-medium line-height-2">
                        How to cook it
                    </h2>
                    <p className="mt-2xs text-gray-600 text-zinc-300//dark">
                        This recipe was carefully designed and tested by{" "}
                        {recipe.publisher}. Please check out directions at their
                        website.
                    </p>
                    <Button
                        href={recipe.source_url}
                        target="_blank"
                        bold
                        padSize="lg"
                        className="text-no-decoration mt-m w-full//below-sm none//print"
                    >
                        Click here for directions
                    </Button>
                </section>
            </div>

            {isDeleteModalRendered && (
                <Modal
                    isCloseRendered
                    clearClassName
                    isVisible={isDeleteModalVisible}
                    onClose={closeDeleteModal}
                    className="max-w-m mt-m p-fluid-m-l"
                >
                    <div className="stack text-center//above-sm">
                        <h2
                            id="modal-title"
                            className="f-family-secondary f-size-fluid-3 f-weight-bold line-height-2"
                        >
                            Delete Recipe
                        </h2>
                        <p className="text-gray-600 text-zinc-200//dark">
                            Are you sure you want to delete this recipe?
                        </p>
                        <div className="flex justify-content-center gap-s w-full flex-direction-column//below-sm mt-l">
                            <Button
                                bold
                                padSize="lg"
                                color="tertiary"
                                className="w-full//below-sm"
                                onClick={closeDeleteModal}
                            >
                                Go Back
                            </Button>
                            <Button
                                bold
                                padSize="lg"
                                color="error"
                                className="w-full//below-sm"
                                loading={isLoading}
                                onClick={handleRemoveRecipeClick}
                            >
                                Delete Recipe
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default SingleRecipe;
