import Icon from "../../components/Icon.jsx";
import SearchRecipesButtons from "./SearchRecipesButtons.jsx";
import SearchForm from "./SearchForm.jsx";
import Navigation from "../../components/Navigation.jsx";
import { useMediaQuery } from "@uidotdev/usehooks";

const SearchRecipesPage = () => {
    const isAboveSm = useMediaQuery("(width >= 30em)");

    return (
        <div className="grid align-content-start wrapper h-screen py-m py-xl//above-md">
            <header className="justify-self-end align-self-start">
                <Navigation
                    filterItems={["search"]}
                    hideItemsLabel={isAboveSm}
                    itemClassName="bg-zinc-800 radius-1 p-xs p-s//above-md "
                />
            </header>
            <div className="flex flex-direction-column align-items-center gap-l gap-xl//above-sm pt-m pt-5xl//above-md">
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

                <SearchRecipesButtons />
            </div>
        </div>
    );
};

export default SearchRecipesPage;
