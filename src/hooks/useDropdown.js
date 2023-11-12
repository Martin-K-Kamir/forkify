import { useState } from "react";

const useDropdown = () => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const showDropdown = () => {
        setIsDropdownVisible(true);
    };

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const closeDropdown = () => {
        setIsDropdownVisible(false);
    };

    return {
        isDropdownVisible,
        showDropdown,
        toggleDropdown,
        closeDropdown,
    };
};

export default useDropdown;
