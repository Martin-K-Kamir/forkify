import { useParams } from "react-router-dom";
import {
    useGetRecipeQuery,
    useUpdateBookmarkMutation,
} from "./recipiesSlice.js";
import Icon from "../../components/Icon.jsx";
import { capitalazeForEach } from "../../utilities.js";
import { useEffect, useState } from "react";
import Fraction from "fraction.js";
import { useDispatch, useSelector } from "react-redux";
import {
    addBookmark,
    selectBookmarkById,
} from "../bookmarks/bookmarksSlice.js";

const SingleRecipePage = () => {
    const dispatch = useDispatch();
    const { recipeId } = useParams();
    const {
        data: recipe,
        isLoading,
        isError,
        isSuccess,
        error,
    } = useGetRecipeQuery(recipeId);
    const [updateBookmark] = useUpdateBookmarkMutation({
        selectFromResult: () => ({}),
    });

    const bookmarkRecipe = useSelector(state =>
        selectBookmarkById(state, recipeId)
    );

    console.log({ bookmarkRecipe });

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

    const handleBookmarkClick = () => {
        updateBookmark({ id: recipeId, isBookmarked: !recipe.isBookmarked });
    };

    if (isLoading) {
        return (
            <div className="flex justify-content-center">
                <Icon
                    type="progressActivity"
                    className="animation-spin f-size-5"
                />
            </div>
        );
    } else if (isError) {
        return (
            <div className="text-center f-size-1 f-weight-medium text-red-100 flex align-items-center justify-content-center flex-direction-column gap-2xs">
                <Icon type="warning" className="f-size-3" />
                {error?.message || "Something went wrong! Please try again."}
            </div>
        );
    } else if (isSuccess) {
        const renderedIngredients = (ingredients ?? recipe.ingredients).map(
            ({ quantity, unit, description }, i) => {
                let quantityString = quantity;
                if (quantity) {
                    const fraction = new Fraction(quantity);
                    quantityString = fraction.toFraction(true);
                }

                return (
                    <li key={i} className="list-align-text mt-3xs">
                        {quantityString} {unit} {description}
                    </li>
                );
            }
        );

        return (
            <div className="bg-zinc-800//above-sm radius-1 max-w-xl mx-auto p-fluid-m-l//above-sm pb-fluid-l-xl//above-sm">
                <img
                    className="w-full aspect-ratio-16x9 object-cover radius-1"
                    src={recipe.image_url}
                    alt={recipe.title}
                />
                <div className="stack s-l mt-fluid-s-m">
                    <header>
                        <div className="flex flex-wrap justify-content-between align-items-center gap-xs">
                            <h1 className="f-family-secondary f-size-fluid-4 f-size-fluid-5//above-sm f-weight-bold line-height-2">
                                {capitalazeForEach(recipe.title)}
                            </h1>
                            <div className="flex align-items-center gap-fluid-2xs-xs">
                                {/*<button className="flex justify-content-center align-items-center p-2xs radius-circle bg-zinc-700">*/}
                                {/*    <Icon*/}
                                {/*        type="person"*/}
                                {/*        fill*/}
                                {/*        className="f-size-1"*/}
                                {/*    />*/}
                                {/*</button>*/}
                                {/*<button className="flex justify-content-center align-items-center p-2xs radius-circle bg-red-700">*/}
                                {/*    <Icon type="delete" className="f-size-1" />*/}
                                {/*</button>*/}
                                <button
                                    onClick={handleBookmarkClick}
                                    className="flex justify-content-center align-items-center p-2xs radius-circle bg-blue-700"
                                >
                                    <Icon
                                        type="bookmarks"
                                        className="f-size-1"
                                        fill={
                                            bookmarkRecipe?.isBookmarked ??
                                            recipe.isBookmarked
                                        }
                                    />
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-wrap align-items-center gap-2xs text-zinc-300 mt-s mt-xs//above-sm">
                            <div className="flex align-items-center f-weight-medium mr-xs">
                                <Icon
                                    type="schedule"
                                    className="f-size-2 mr-xs"
                                />
                                <p>{recipe.cooking_time} minutes</p>
                            </div>
                            <div className="flex align-items-center f-weight-medium">
                                <Icon
                                    type="group"
                                    fill
                                    className="f-size-2 mr-xs"
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
                    <div>
                        <h2 className="f-family-secondary f-size-fluid-3 f-weight-bold line-height-2">
                            Recipe ingredients
                        </h2>
                        <ul className="list-style-inside mt-2xs text-zinc-300">
                            {renderedIngredients}
                        </ul>
                    </div>
                    <div>
                        <h2 className="f-family-secondary f-size-fluid-3 f-weight-bold line-height-2">
                            How to cook it
                        </h2>
                        <p className="mt-2xs text-zinc-300">
                            This recipe was carefully designed and tested by{" "}
                            {recipe.publisher}. Please check out directions at
                            their website.
                        </p>
                        <a
                            className="inline-block bg-blue-700 text-zinc-050 text-no-decoration text-center f-weight-medium f-size-1 line-height-1 radius-1 px-m py-xs mt-m w-full//below-sm"
                            href={recipe.source_url}
                        >
                            Click here for directions
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default SingleRecipePage;
