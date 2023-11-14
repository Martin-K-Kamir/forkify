import SearchRecipes from "../features/recipes/SearchRecipes.jsx";
import Icon from "./Icon.jsx";
import Overlay from "./Overlay.jsx";
import useModal from "../hooks/useModal.js";
import Modal from "./Modal.jsx";
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import className from "classnames";
import { useLocalStorage, useMediaQuery } from "@uidotdev/usehooks";

const NavigationItem = ({
    url,
    onClick,
    icon,
    label,
    ariaOptions,
    isLabelVisible,
    ...rest
}) => {
    const ButtonType = Boolean(url) ? Link : "button";

    const buttonClasses = className(
        "flex align-items-center gap-3xs f-size--1 text-zinc-050 text-no-decoration line-height-1",
        rest.className
    );

    const labelRendered = isLabelVisible ?? true;

    return (
        <li key={label}>
            <ButtonType
                className={buttonClasses}
                to={url}
                onClick={onClick}
                {...ariaOptions}
            >
                <Icon className="f-size-2" type={icon} />
                {labelRendered && label}
            </ButtonType>
        </li>
    );
};

const Navigation = ({
    itemsToRender,
    filterItems,
    hideItemsLabel,
    className,
}) => {
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
        document.body.dataset.theme = theme;

        return () => {
            delete document.body.dataset.theme;
        };
    }, [theme]);

    const handleThemeClick = () => {
        if (theme === "light") {
            saveTheme("dark");
        } else {
            saveTheme("light");
        }
    };

    const navigationItems = [
        {
            id: "search",
            label: "Search",
            icon: "search",
            onClick: showSearchModal,
            ariaOptions: {
                "aria-expanded": isSearchModalVisible,
                "aria-haspopup": "true",
                "aria-controls": "search-modal",
            },
        },
        {
            id: "menu",
            label: "Menu",
            icon: "menu",
            onClick: showMenuModal,
            ariaOptions: {
                "aria-expanded": null,
                "aria-haspopup": "true",
                "aria-controls": "menu-modal",
            },
        },
    ];

    const menuItems = [
        {
            id: "myRecipes",
            label: "My Recipes",
            icon: "bookmarks",
            url: "/my-recipes",
        },
        {
            id: "addRecipe",
            label: "Add Recipe",
            icon: "postAdd",
            url: "/add-recipe",
        },
        {
            id: "theme",
            label: theme === "light" ? "Dark Mode" : "Light Mode",
            icon: theme === "light" ? "darkMode" : "lightMode",
            onClick: handleThemeClick,
        },
    ];

    const renderedNavigationItems = (
        itemsToRender === "menu" ? menuItems : navigationItems
    )
        .filter(item => !filterItems?.includes(item.id))
        .map(item => (
            <NavigationItem
                key={item.id}
                {...item}
                isLabelVisible={hideItemsLabel}
            />
        ));

    const renderedMenuItems = menuItems
        .filter(item => !filterItems?.includes(item.id))
        .map(item => (
            <NavigationItem
                key={item.id}
                {...item}
                className="f-size-1 gap-xs"
            />
        ));

    return (
        <>
            <nav aria-label="primary" className={className}>
                <ul className="flex align-items-center gap-m" role="list">
                    {renderedNavigationItems}
                </ul>
            </nav>

            {isMenuModalRendered && (
                <Modal
                    className="max-w-l bg-zinc-900 mt-m py-xl px-fluid-l-xl"
                    isVisible={isMenuModalVisible}
                    onClose={closeMenuModal}
                >
                    <nav id="menu-modal" aria-label="menu">
                        <ul
                            className="flex flex-direction-column align-items-center gap-fluid-m-l"
                            role="list"
                        >
                            {renderedMenuItems}
                            <div className="bg-zinc-800 h-px w-full"></div>
                            <button
                                className="bg-blue-700 f-weight-medium f-size-1 line-height-1 radius-1 px-m py-s max-w-xs w-full"
                                aria-controls="menu-modal"
                                onClick={closeMenuModal}
                            >
                                Close Menu
                            </button>
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
                    <SearchRecipes
                        formOptions={{
                            id: "search-modal",
                            className: "mx-auto mt-s flex-direction-column",
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
