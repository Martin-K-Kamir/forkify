import React, { Fragment } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { capitalizedForEach } from "../utilities.js";

const Breadcrumbs = ({ title }) => {
    const { pathname } = useLocation();
    const { recipeId, recipesId } = useParams();

    const ignoreCrumbs = ["search"];

    const crumbs = pathname
        .split("/")
        .filter(crumb => {
            return !ignoreCrumbs.includes(crumb) && crumb !== "";
        })
        .map(crumb => {
            if (recipeId && crumb === recipeId) {
                return title;
            }

            return crumb;
        });

    const formatCrumb = crumb => {
        return crumb.split("-").join(" ");
    };

    const renderedCrumbs = ["home", ...crumbs].map((crumb, index, arr) => {
        const isLastIndex = index === arr.length - 1;

        const formattedCrumb = formatCrumb(crumb);
        const capitalazedCrumb = capitalizedForEach(crumb);

        return (
            <Fragment key={index}>
                {isLastIndex ? (
                    <span>{capitalazedCrumb}</span>
                ) : (
                    <Link to={`/${crumb}`} className="text-zinc-050">
                        {capitalazedCrumb}
                    </Link>
                )}
                {!isLastIndex && (
                    <span className="text-zinc-050 mx-2xs">/</span>
                )}
            </Fragment>
        );
    });

    return <div className="f-size--1">{renderedCrumbs}</div>;
};

export default Breadcrumbs;
