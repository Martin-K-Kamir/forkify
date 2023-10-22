import Icon from "../Icon.jsx";
import SearchForm from "../../features/recipes/SearchForm.jsx";
import { useMediaQuery, useLocalStorage } from "@uidotdev/usehooks";
import { useEffect, useRef, useState } from "react";
import NavigationListSecondary from "./NavigationListSecondary.jsx";
import NavigationListPrimary from "./NavigationListPrimary.jsx";

const Navigation = () => {
    const isDarkThemePreferred = useMediaQuery("(prefers-color-scheme: dark)");
    const isBelowLg = useMediaQuery("(width < 64em)");
    const isAboveLg = useMediaQuery("(width >= 64em)");
    const [theme, saveTheme] = useLocalStorage("theme", null);

    const [isSearchModalRendered, setIsSearchModalRendered] = useState(false);
    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
    const [isMenuModalRendered, setIsMenuModalRendered] = useState(false);
    const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);
    const searchModalRef = useRef(null);
    const menuModalRef = useRef(null);

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

    useEffect(() => {
        if (!isSearchModalRendered && !isMenuModalRendered) return;
        document.body.dataset.scroll = "disabled";

        const handleOutsideSearchClick = handleOutsideClick(
            setIsSearchModalRendered,
            setIsSearchModalVisible,
            searchModalRef
        );

        const handleOutsideMenuClick = handleOutsideClick(
            setIsMenuModalRendered,
            setIsMenuModalVisible,
            menuModalRef
        );

        if (isSearchModalRendered) {
            document.addEventListener("click", handleOutsideSearchClick, true);
        }

        if (isMenuModalRendered) {
            document.addEventListener("click", handleOutsideMenuClick, true);
        }

        return () => {
            delete document.body.dataset.scroll;
            document.removeEventListener("click", handleOutsideSearchClick);
            document.removeEventListener("click", handleOutsideMenuClick);
        };
    }, [isSearchModalRendered, isMenuModalRendered]);

    useEffect(() => {
        if (isBelowLg) {
            setIsMenuModalRendered(false);
            setIsMenuModalVisible(false);
        }

        if (isAboveLg) {
            setIsMenuModalRendered(true);
            setIsMenuModalVisible(true);
        }
    }, [isBelowLg, isAboveLg]);

    const handleClick = (isRendered, mountFn, visibleFn) => {
        if (isRendered) {
            visibleFn(false);

            setTimeout(() => {
                mountFn(false);
            }, 300);
        } else {
            mountFn(true);

            setTimeout(() => {
                visibleFn(true);
            }, 0);
        }
    };

    const handleOutsideClick = (mountFn, visibleFn, ref) => e => {
        if (ref.current === e.target) {
            visibleFn(false);

            setTimeout(() => {
                mountFn(false);
            }, 300);
        }
    };

    const handleThemeClick = () => {
        if (theme === "light") {
            saveTheme("dark");
        } else {
            saveTheme("light");
        }
    };

    const handleSearchSubmit = async (e, onSubmit) => {
        try {
            await onSubmit(e);

            setIsSearchModalVisible(false);

            setTimeout(() => {
                setIsSearchModalRendered(false);
            }, 300);
        } catch {}
    };

    return (
        <header className="flex align-items-center justify-content-between gap-s bg-zinc-800 radius-1 p-m mb-fluid-m-l">
            <p className="f-family-secondary f-size-2 f-size-3//above-sm f-weight-medium line-height-1">
                Forkify
            </p>

            {isAboveLg && (
                <SearchForm
                    render={({
                        value,
                        disabled,
                        isLoading,
                        onSubmit,
                        onChange,
                    }) => (
                        <form
                            className="form flex max-w-s gap-s w-full"
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
                                className="bg-blue-700 px-xs py-2xs  radius-1 flex justify-content-center align-items-center"
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
                {isBelowLg && (
                    <NavigationListPrimary
                        isSearchModalRendered={isSearchModalRendered}
                        onSearchClick={() =>
                            handleClick(
                                isSearchModalVisible,
                                setIsSearchModalRendered,
                                setIsSearchModalVisible
                            )
                        }
                        isMenuModalRendered={isMenuModalRendered}
                        onMenuClick={() =>
                            handleClick(
                                isMenuModalRendered,
                                setIsMenuModalRendered,
                                setIsMenuModalVisible
                            )
                        }
                    />
                )}

                {isMenuModalRendered && (
                    <NavigationListSecondary
                        theme={theme}
                        onThemeClick={handleThemeClick}
                        menuModalRef={menuModalRef}
                        isMenuModalVisible={isMenuModalVisible}
                        onMenuClick={() =>
                            handleClick(
                                isMenuModalRendered,
                                setIsMenuModalRendered,
                                setIsMenuModalVisible
                            )
                        }
                    />
                )}
            </div>

            {isSearchModalRendered && (
                <SearchForm
                    render={({
                        value,
                        disabled,
                        isLoading,
                        onSubmit,
                        onChange,
                    }) => (
                        <div
                            ref={searchModalRef}
                            role="button"
                            id="search-modal"
                            className="fixed inset-0 z-index-800 backdrop-blur-md bg-zinc-950/90 flex justify-content-center align-items-start pt-fluid-2xl-3xl transition-opacity"
                            aria-expanded={isSearchModalRendered}
                            data-opacity={isSearchModalVisible}
                        >
                            <button
                                className="absolute z-index-1 top-xs right-xs text-zinc-200"
                                onClick={() =>
                                    handleClick(
                                        isSearchModalVisible,
                                        setIsSearchModalRendered,
                                        setIsSearchModalVisible
                                    )
                                }
                            >
                                <Icon
                                    type="close"
                                    className="f-size-3 flex-shrink-0"
                                />
                            </button>
                            <div
                                className="flex justify-content-center align-items-start max-w-l w-full mx-m transition-fade-up"
                                data-fade-up={isSearchModalVisible}
                            >
                                <form
                                    className="form flex max-w-l gap-m w-full flex-direction-column"
                                    onSubmit={e =>
                                        handleSearchSubmit(e, onSubmit)
                                    }
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
                            </div>
                        </div>
                    )}
                />
            )}
        </header>
    );
};

export default Navigation;
