import Icon from "./Icon.jsx";
import SearchForm from "../features/recipes/SearchForm.jsx";
import { useMediaQuery } from "@uidotdev/usehooks";
import Navigation from "./Navigation.jsx";
import { useLocation } from "react-router-dom";

const Header = () => {
    const location = useLocation();
    const isAboveLg = useMediaQuery("(width >= 64em)");

    const isLandingPage = location.pathname === "/";

    return (
        <header className="flex align-items-center justify-content-between gap-s bg-zinc-800 radius-1 p-m mb-fluid-m-l">
            <p className="f-family-secondary f-size-2 f-size-3//above-sm f-weight-medium line-height-1">
                Forkify
            </p>

            {isAboveLg && !isLandingPage && (
                <SearchForm
                    render={({
                        value,
                        disabled,
                        isLoading,
                        onSubmit,
                        onChange,
                    }) => (
                        <form
                            className="form flex max-w-s gap-xs w-full"
                            onSubmit={onSubmit}
                        >
                            <input
                                type="text"
                                className="bg-zinc-900 f-size--1 px-xs py-2xs radius-1 w-full"
                                placeholder="Search over 1,000,000 recipes"
                                value={value}
                                onChange={onChange}
                            />
                            <button
                                className="bg-blue-700 px-2xs py-2xs radius-1 flex justify-content-center align-items-center"
                                disabled={disabled}
                            >
                                {isLoading ? (
                                    <Icon
                                        type="progressActivity"
                                        className="animation-spin f-size-fluid-3"
                                    />
                                ) : (
                                    <Icon className="f-size-2" type="search" />
                                )}
                            </button>
                        </form>
                    )}
                />
            )}

            <div className="flex-shrink-0">
                <Navigation
                    filterItems={isLandingPage ? ["search"] : []}
                    itemsToRender={
                        isLandingPage
                            ? "default"
                            : isAboveLg
                            ? "menu"
                            : "default"
                    }
                />
            </div>
        </header>
    );
};

export default Header;
