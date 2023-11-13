import React, { Fragment } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { capitalizeWords } from "../utilities.js";
import Icon from "./Icon.jsx";

const Breadcrumbs = ({title}) => {
    const {pathname} = useLocation();
    const {recipeId} = useParams();

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

        let title = crumb;
        if (crumb !== "home") {
            title = capitalizeWords(removeHyphens(crumb));
        }

        return (
            <Fragment key={index}>
                {isLastIndex ? (
                    <span className="line-height-1">{crumb}</span>
                ) : (
                    <Link to={`/${crumb}`} className="text-blue-500 flex line-height-1">
                        {crumb === "home" ? (
                            <Icon type={crumb} className="f-size-2"/>
                        ) : title}
                    </Link>
                )}
                {!isLastIndex && (
                    <span className="text-zinc-050 flex">
                        <Icon type="chevronRight" className="f-size-1 mx-3xs" />
                    </span>
                )}
            </Fragment>
        );
    });

    return <div className="flex align-items-center f-size--1">{renderedCrumbs}</div>;
};

export default Breadcrumbs;
