import { useMediaQuery } from "@uidotdev/usehooks";
import NavigationListItem from "./NavigationListItem.jsx";
import React from "react";

const NavigationListSecondary = ({
    theme,
    onThemeClick,
    menuModalRef,
    isMenuModalVisible,
    onMenuClick,
}) => {
    const isBelowLg = useMediaQuery("(width < 64em)");
    const isAboveLg = useMediaQuery("(width >= 64em)");

    const navigationItems = [
        {
            label: "Bookmarks",
            icon: "bookmarks",
            url: "bookmarks",
            ...(isBelowLg && { onClick: onMenuClick }),
        },
        {
            label: "Add Recipe",
            icon: "postAdd",
            url: "/add-recipe",
            ...(isBelowLg && { onClick: onMenuClick }),
        },
        {
            label: theme === "light" ? "Dark Mode" : "Light Mode",
            icon: theme === "light" ? "darkMode" : "lightMode",
            onClick: onThemeClick,
        },
    ];

    const renderedItems = navigationItems.map(item => (
        <NavigationListItem
            className="f-size-1//below-lg gap-xs//below-lg"
            key={item.label}
            {...item}
        />
    ));

    return (
        <nav
            ref={menuModalRef}
            id={isBelowLg ? "navigation-secondary" : undefined}
            aria-label={isAboveLg ? "primary" : "secondary"}
            className={
                isBelowLg
                    ? "fixed//below-lg inset-0//below-lg z-index-800//below-lg backdrop-blur-md//below-lg bg-zinc-950/90//below-lg transition-opacity"
                    : undefined
            }
            aria-expanded={isBelowLg ? "true" : undefined}
            aria-hidden={isBelowLg ? "false" : undefined}
            data-opacity={isBelowLg ? isMenuModalVisible : undefined}
        >
            <ul
                className={`wrapper//below-lg radius-1//below-lg flex flex-direction-column//below-lg align-items-center bg-zinc-900//below-lg mt-m//below-lg p-xl//below-lg gap-m gap-l//below-lg ${
                    isBelowLg ? "transition-fade-up" : ""
                }`}
                data-fade-up={isBelowLg ? isMenuModalVisible : undefined}
                role="list"
            >
                {renderedItems}
                {isBelowLg && (
                    <>
                        <div className="bg-zinc-800 h-px w-full"></div>
                        <button
                            className="bg-blue-700 f-weight-medium f-size-1 line-height-1 radius-1 px-m py-xs max-w-xs w-full"
                            onClick={onMenuClick}
                            aria-controls="navigation-secondary"
                            aria-expanded="true"
                            aria-haspopup="true"
                        >
                            Close Menu
                        </button>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default NavigationListSecondary;
