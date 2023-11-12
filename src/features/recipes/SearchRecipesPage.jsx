import Icon from "../../components/Icon.jsx";
import SearchRecipeQueriesButtons from "./SearchRecipeQueriesButtons.jsx";
import SearchForm from "./SearchForm.jsx";

const SearchRecipesPage = () => {
    return (
        <div className="flex flex-direction-column align-items-center gap-l gap-xl//above-sm mt-fluid-l-4xl">
            <h1 className="block f-family-secondary f-size-5 f-size-6//above-sm f-weight-medium line-height-1">
                Forkify
            </h1>

            <SearchForm
                render={({
                    value,
                    disabled,
                    isLoading,
                    onSubmit,
                    onChange,
                }) => (
                    <form
                        className="form flex max-w-l gap-s w-full flex-direction-column//below-md"
                        onSubmit={onSubmit}
                    >
                        <input
                            type="text"
                            className="bg-zinc-800 p-s radius-1 w-full"
                            placeholder="Search over 1,000,000 recipes"
                            value={value}
                            onChange={onChange}
                        />
                        <button
                            className="button f-weight-medium radius-1 flex justify-content-center align-items-center"
                            disabled={disabled}
                        >
                            {isLoading ? (
                                <Icon
                                    type="progressActivity"
                                    className="animation-spin f-size-fluid-3"
                                />
                            ) : (
                                "Search"
                            )}
                        </button>
                    </form>
                )}
            />

            <SearchRecipeQueriesButtons />
        </div>
    );
};

export default SearchRecipesPage;
