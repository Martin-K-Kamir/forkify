import React, { Fragment } from "react";
import { useLocation, useParams } from "react-router-dom";
import { capitalizeWords } from "../utilities.js";
import Icon from "./Icon.jsx";
import Button from "./Button.jsx";
import IconButton from "./IconButton.jsx";

const Breadcrumbs = ({ title }) => {
    const { pathname } = useLocation();
    const { recipeId, recipesId } = useParams();

    const blacklist = ["search"];

    const crumbs = pathname
        .split("/")
        .filter(crumb => {
            return !blacklist.includes(crumb) && crumb !== "";
        })
        .map(crumb => {
            if (recipeId && crumb === recipeId) {
                return title;
            }

            return crumb;
        });

    const removeHyphens = crumb => {
        return crumb.split("-").join(" ");
    };

    const renderedCrumbs = ["home", ...crumbs].map((crumb, index, arr) => {
        const isLastIndex = index === arr.length - 1;
        const isHome = crumb === "home";

        let title = crumb;
        if (crumb !== "home") {
            title = capitalizeWords(removeHyphens(crumb));
        }

        let url = `/${crumb}`;
        if (recipesId && crumb === recipesId) {
            url = `/search/${crumb}`;
        }
        if (isHome) {
            url = "/";
        }

        return (
            <Fragment key={index}>
                {isLastIndex ? (
                    <span className="text-ellipsis">{crumb}</span>
                ) : isHome ? (
                    <IconButton
                        to={url}
                        variant="text"
                        srOnly="Go to home page"
                        hover="none"
                    >
                        <Icon type="home" className="f-size-2" />
                    </IconButton>
                ) : (
                    <Button
                        to={url}
                        variant="text"
                        fontSize="sm"
                        className="text-no-decoration"
                        srOnly={isHome && "Go to home page"}
                        hover="none"
                    >
                        {title}
                    </Button>
                )}
                {!isLastIndex && (
                    <span className="flex">
                        <Icon type="chevronRight" className="f-size-1 mx-3xs" />
                    </span>
                )}
            </Fragment>
        );
    });

    return (
        <div className="flex align-items-center f-size--1 line-height-1">
            {renderedCrumbs}
        </div>
    );
};

export default Breadcrumbs;
