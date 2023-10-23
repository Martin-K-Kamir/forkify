import { useParams } from "react-router-dom";
import { useGetRecipeQuery } from "./recipiesSlice.js";
import Icon from "../../components/Icon.jsx";
import Fraction from "fraction.js";

const SingleRecipePage = () => {
    const { recipeId } = useParams();
    const { data, isLoading, isError, isSuccess, error } =
        useGetRecipeQuery(recipeId);

    console.log(data);

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
                    <li key={description}>
                        {quantityString} {unit} {description}
                    </li>
                );
            }
        );

        return (
            <div className="max-w-xl mx-auto">
                <img
                    className="w-full aspect-ratio-16x9 object-cover radius-1"
                    src={data.image_url}
                    alt={data.title}
                />
                <h1>{data.title}</h1>
                <div>
                    <p>{data.cooking_time} minutes</p>
                    <p>{data.servings} servings</p>
                </div>
                <div>
                    <h2>Recipe ingredients</h2>
                    <ul>{renderedIngredients}</ul>
                </div>
                <div>
                    <h2>Recipe method</h2>
                    <p>
                        This recipe was carefully designed and tested by{" "}
                        {data.publisher}. Please check out directions at their
                        website.
                    </p>
                    <a href={data.source_url}>link</a>
                </div>
            </div>
        );
    }

    return null;
};

export default SingleRecipePage;
