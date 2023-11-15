import SearchRecipes from "../features/recipes/SearchRecipes.jsx";
import { useMediaQuery } from "@uidotdev/usehooks";
import Navigation from "./Navigation.jsx";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
    const location = useLocation();
    const isAboveLg = useMediaQuery("(width >= 64em)");

    const isLandingPage = location.pathname === "/";

    return (
        <header className="flex align-items-center justify-content-between gap-s bg-zinc-800 radius-1 p-m mb-fluid-m-l">
            <Link to="/" className="f-family-secondary text-no-decoration text-zinc-050 f-size-2 f-size-3//above-sm f-weight-medium line-height-1">
                Forkify
            </Link>

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
