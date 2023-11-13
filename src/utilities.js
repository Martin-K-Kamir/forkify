export const capitalizeWords = string => {
    return string
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

export const wait = async ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
