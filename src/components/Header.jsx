import SearchRecipesForm from "../features/recipes/SearchRecipesForm.jsx";
import { useMediaQuery } from "@uidotdev/usehooks";
import Navigation from "./Navigation.jsx";
import { Link, useLocation } from "react-router-dom";
import Button from "./Button.jsx";

const Header = () => {
    const location = useLocation();
    const isAboveLg = useMediaQuery("(width >= 64em)");

    const isLandingPage = location.pathname === "/";

    return (
        <header className="flex align-items-center justify-content-between gap-s bg-gray-050 bg-zinc-800//dark radius-1 px-m py-s py-m//above-lg mb-l">
            <Link
                to="/"
                className="f-family-secondary text-no-decoration text-gray-800 text-zinc-050//dark f-size-2 f-size-3//above-lg f-weight-medium line-height-1 outline-size-l radius-1 outline-offset-m"
            >
                Forkify
            </Link>

            {isAboveLg && !isLandingPage && (
                <SearchRecipesForm
                    size="md"
                    inputOptions={{
                        backgroundClassName: "bg-gray-200 bg-zinc-850//dark",
                    }}
                    autocompleteOptions={{
                        shouldOverlay: true,
                    }}
                />
            )}

            <div className="flex-shrink-0">
                <Navigation
                    buttonsToFilter={isLandingPage ? ["search"] : []}
                    buttonsToRender={isAboveLg ? "menu" : "default"}
                />
            </div>
        </header>
    );
};

export default Header;
