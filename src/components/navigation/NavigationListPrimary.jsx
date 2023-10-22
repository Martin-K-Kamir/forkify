import NavigationListItem from "./NavigationListItem.jsx";

const NavigationListPrimary = ({
    searchModalMount,
    onSearchClick,
    isMenuModalRendered,
    onMenuClick,
}) => {
    const navigationItems = [
        {
            label: "Search",
            icon: "search",
            onClick: onSearchClick,
            ariaOptions: {
                "aria-expanded": searchModalMount,
                "aria-haspopup": "true",
                "aria-controls": "search-modal",
            },
        },
        {
            label: "Menu",
            icon: "menu",
            onClick: onMenuClick,
            ariaOptions: {
                "aria-expanded": isMenuModalRendered,
                "aria-haspopup": "true",
                "aria-controls": "navigation-secondary",
            },
        },
    ];

    const renderedItems = navigationItems.map(item => (
        <NavigationListItem key={item.label} {...item} />
    ));

    return (
        <nav aria-label="primary">
            <ul className="flex align-items-center gap-m" role="list">
                {renderedItems}
            </ul>
        </nav>
    );
};

export default NavigationListPrimary;
