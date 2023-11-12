export const capitalizedForEach = string => {
    return string
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export const wait = async ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
