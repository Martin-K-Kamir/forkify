import { useParams } from "react-router-dom";
import { useGetRecipeQuery } from "./recipiesSlice.js";
import Icon from "../../components/Icon.jsx";
import Fraction from "fraction.js";

const SingleRecipePage = () => {
    const { recipeId } = useParams();
    const { data, isLoading, isError, isSuccess, error } =
        useGetRecipeQuery(recipeId);

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
        const renderedIngredients = data.ingredients.map(
            ({ quantity, unit, description }) => {
                let quantityString = quantity;
                if (quantity) {
                    const fraction = new Fraction(quantity);
                    quantityString = fraction.toFraction(true);
                }

                return (
                    <li key={description} className="list-align-text mt-3xs">
                        {quantityString} {unit} {description}
                    </li>
                );
            }
        );

        return (
            <div className="bg-zinc-800//above-sm radius-1 max-w-xl mx-auto p-fluid-m-l//above-sm pb-fluid-l-xl//above-sm">
                <img
                    className="w-full aspect-ratio-16x9 object-cover radius-1"
                    src={data.image_url}
                    alt={data.title}
                />
                <div className="stack s-l mt-fluid-s-m">
                    <header>
                        <div className="flex flex-wrap justify-content-between align-items-center gap-xs">
                            <h1 className="f-family-secondary f-size-fluid-4 f-size-fluid-5//above-sm f-weight-bold line-height-2 text-balance">
                                {data.title}
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
                                <button className="flex justify-content-center align-items-center p-2xs radius-circle bg-blue-700">
                                    <Icon
                                        type="bookmarks"
                                        className="f-size-1"
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
                                <p>{data.cooking_time} minutes</p>
                            </div>
                            <div className="flex align-items-center f-weight-medium">
                                <Icon
                                    type="group"
                                    fill
                                    className="f-size-2 mr-xs"
                                />
                                <p>{data.servings} servings</p>
                                <div className="flex align-items-center gap-3xs f-size-2 ml-xs">
                                    <button
                                        className="flex justify-content-center align-items-center text-blue-500"
                                        aria-label="Decrease the number of servings"
                                    >
                                        <Icon type="downCircle" />
                                    </button>
                                    <button
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
                        <ul className="list-style-inside mt-2xs text-balance text-zinc-300">
                            {renderedIngredients}
                        </ul>
                    </div>
                    <div>
                        <h2 className="f-family-secondary f-size-fluid-3 f-weight-bold line-height-2">
                            How to cook it
                        </h2>
                        <p className="mt-2xs text-balance text-zinc-300">
                            This recipe was carefully designed and tested by{" "}
                            {data.publisher}. Please check out directions at
                            their website.
                        </p>
                        <a
                            className="inline-block bg-blue-700 text-zinc-050 text-no-decoration text-center f-weight-medium f-size-1 line-height-1 radius-1 px-m py-xs mt-m w-full//below-sm"
                            href={data.source_url}
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
