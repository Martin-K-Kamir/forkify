import SearchRecipesForm from "../features/recipes/SearchRecipesForm.jsx";
import Icon from "./Icon.jsx";
import Overlay from "./Overlay.jsx";
import useModal from "../hooks/useModal.js";
import Modal from "./Modal.jsx";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLocalStorage, useMediaQuery } from "@uidotdev/usehooks";
import Button from "./Button.jsx";

const Navigation = ({ buttonsToRender, buttonsToFilter, className }) => {
    const location = useLocation();

    const isDarkThemePreferred = useMediaQuery("(prefers-color-scheme: dark)");
    const [theme, saveTheme] = useLocalStorage("theme", null);

    const {
        isModalVisible: isSearchModalVisible,
        isModalRendered: isSearchModalRendered,
        showModal: showSearchModal,
        closeModal: closeSearchModal,
    } = useModal();

    const {
        isModalVisible: isMenuModalVisible,
        isModalRendered: isMenuModalRendered,
        showModal: showMenuModal,
        closeModal: closeMenuModal,
    } = useModal();

    useEffect(() => {
        if (isSearchModalVisible) {
            closeSearchModal();
        }

        if (isMenuModalVisible) {
            closeMenuModal();
        }
    }, [location]);

    useEffect(() => {
        if (theme) return;
        if (isDarkThemePreferred) {
            saveTheme("dark");
        } else {
            saveTheme("light");
        }
    }, []);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;

        return () => {
            delete document.documentElement.dataset.theme;
        };
    }, [theme]);

    const handleThemeClick = () => {
        if (theme === "light") {
            saveTheme("dark");
        } else {
            saveTheme("light");
        }
    };

    const navigationButtons = [
        {
            id: "search",
            content: "Search",
            icon: "search",
            onClick: showSearchModal,
            "aria-expanded": isSearchModalVisible,
            "aria-haspopup": "true",
            "aria-controls": "modal",
        },
        {
            id: "menu",
            content: "Menu",
            icon: "menu",
            onClick: showMenuModal,
            "aria-expanded": isMenuModalVisible,
            "aria-haspopup": "true",
            "aria-controls": "modal",
        },
    ];

    const menuButtons = [
        {
            id: "myRecipes",
            content: "My Recipes",
            icon: "bookmarks",
            to: "/my-recipes",
        },
        {
            id: "addRecipe",
            content: "Add Recipe",
            icon: "postAdd",
            to: "/add-recipe",
        },
        {
            id: "theme",
            content: theme === "light" ? "Dark Mode" : "Light Mode",
            icon: theme === "light" ? "darkMode" : "lightMode",
            onClick: handleThemeClick,
        },
    ];

    const renderedNavigationButtons = (
        buttonsToRender === "menu" ? menuButtons : navigationButtons
    )
        .filter(item => !buttonsToFilter?.includes(item.id))
        .map(({ id, to, content, icon, onClick, ...rest }) => (
            <li key={id} role="presentation">
                <Button
                    {...rest}
                    id={id}
                    to={to}
                    fontSize="sm"
                    variant="text"
                    color="secondary"
                    className="text-no-decoration line-height-0"
                    startIcon={<Icon className="f-size-2" type={icon} />}
                    onClick={onClick}
                    role="menuitem"
                >
                    {content}
                </Button>
            </li>
        ));

    const renderedMenuButtons = menuButtons
        .filter(item => !buttonsToFilter?.includes(item.id))
        .map(({ id, to, content, icon, onClick, ...rest }) => (
            <li key={id} role="presentation">
                <Button
                    {...rest}
                    id={id}
                    to={to}
                    variant="text"
                    color="secondary"
                    className="text-no-decoration line-height-0"
                    startIcon={<Icon className="f-size-2" type={icon} />}
                    onClick={onClick}
                    role="menuitem"
                >
                    {content}
                </Button>
            </li>
        ));

    return (
        <>
            <nav aria-label="primary" className={className}>
                <ul className="flex align-items-center gap-3xs" role="list">
                    {renderedNavigationButtons}
                </ul>
            </nav>

            {isMenuModalRendered && (
                <Modal
                    clearClassName
                    isVisible={isMenuModalVisible}
                    onClose={closeMenuModal}
                    className="max-w-m mt-m py-l px-fluid-m-l shadow-2xl"
                >
                    <nav id="menu-modal" aria-label="menu" role="navigation">
                        <h2 className="sr-only">Menu</h2>
                        <ul
                            className="flex flex-direction-column align-items-center stack s-2xs"
                            role="list"
                        >
                            {renderedMenuButtons}
                            <div className="bg-gray-300 bg-zinc-700//dark h-px w-full mb-m mt-s"></div>
                            <Button
                                bold
                                padSize="lg"
                                aria-controls="modal"
                                aria-expanded={isMenuModalVisible}
                                onClick={closeMenuModal}
                                className="max-w-xs w-full"
                                role="menuitem"
                            >
                                Close Menu
                            </Button>
                        </ul>
                    </nav>
                </Modal>
            )}

            {isSearchModalRendered && (
                <Overlay
                    isCloseRendered
                    isVisible={isSearchModalVisible}
                    onClose={closeSearchModal}
                >
                    <h2 id="modal-title" className="sr-only">
                        Search Recipes
                    </h2>
                    <SearchRecipesForm
                        size="lg"
                        formOptions={{
                            className: "mx-auto mt-s flex-direction-column",
                        }}
                        inputOptions={{
                            backgroundClassName:
                                "bg-gray-200 bg-zinc-850//dark",
                        }}
                        autocompleteOptions={{
                            shouldOverlay: false,
                        }}
                    />
                </Overlay>
            )}
        </>
    );
};

export default Navigation;
