import React, { Fragment } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { capitalizeWords } from "../utilities.js";
import Icon from "./Icon.jsx";

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
                ) : (
                    <Link to={url} className="text-blue-500 flex">
                        {isHome ? (
                            <Icon type={crumb} className="f-size-2" />
                        ) : (
                            title
                        )}
                    </Link>
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
