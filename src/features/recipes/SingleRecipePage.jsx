import { useParams } from "react-router-dom";
import { useGetRecipeQuery } from "./recipiesSlice.js";
import Icon from "../../components/Icon.jsx";

const SingleRecipePage = () => {
    const {recipeId} = useParams();
    const {data, isLoading, isError, error} =
        useGetRecipeQuery(recipeId);

    console.log(data)

    let content;
    if (isLoading) {
        content = (
            <div className="flex justify-content-center">
                <Icon
                    type="progressActivity"
                    className="animation-spin f-size-5"
                />
            </div>
        );
    } else if (isError) {
        content = (
            <div className="text-center f-size-1 f-weight-medium text-red-100 flex align-items-center justify-content-center flex-direction-column gap-2xs">
                <Icon type="warning" className="f-size-3" />
                {error?.message || "Something went wrong! Please try again."}
            </div>
        );
    } else {
        content = 'hi';
    }

    return (
        <div>
            <h1>Recipe page</h1>
            {content}
        </div>
    )
}

export default SingleRecipePage