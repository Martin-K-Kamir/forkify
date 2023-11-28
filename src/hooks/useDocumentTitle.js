import { useEffect } from "react";

const useDocumentTitle = (title, dependencies, condition = true) => {
    const dependenciesArray = Array.isArray(dependencies) ? dependencies : [];

    useEffect(() => {
        const originalTitle = document.title;
        let updateCondition = true;

        if (typeof dependencies === "boolean") {
            updateCondition = dependencies;
        }

        if (updateCondition && condition) {
            document.title = title;
        }

        return () => {
            document.title = originalTitle;
        };
    }, [title, ...dependenciesArray]);
};

export default useDocumentTitle;
