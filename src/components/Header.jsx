import SearchRecipes from "../features/recipes/SearchRecipes.jsx";
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
                <SearchRecipes
                    variant="compact"
                    inputOptions={{
                        className: "bg-zinc-850",
                    }}
                    autocompleteOptions={{
                        shouldOverlay: true,
                    }}
                />
            )}

            <div className="flex-shrink-0">
                <Navigation
                    filterItems={isLandingPage ? ["search"] : []}
                    itemsToRender={isAboveLg ? "menu" : "default"}
                />
            </div>
        </header>
    );
};

export default Header;
