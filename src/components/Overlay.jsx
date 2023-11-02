import classNames from "classnames";
import { useEffect } from "react";

const Overlay = ({ children, ...rest }) => {
    useEffect(() => {
        if (rest.isVisible) {
            document.body.style.overflow = "hidden";
        }

        return () => {
            delete document.body.dataset.scroll;
        };
    }, [rest.isVisible]);

    const classes = classNames(
        "fixed inset-0 z-index-800 backdrop-blur-md bg-zinc-950/90",
        {
            "flex align-items-center justify-content-center": rest.center,
            "transition-opacity": rest.transition,
        },
        rest.className
    );

    return (
        <div className={classes} data-opacity={rest.isVisible}>
            {children}
        </div>
    );
};

export default Overlay;
