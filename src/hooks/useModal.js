import { useState } from "react";

const useModal = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalRendered, setIsModalRendered] = useState(false);

    const showModal = () => {
        setIsModalRendered(true);

        setTimeout(() => {
            setIsModalVisible(true);
        }, 0);
    };

    const toggleModal = () => {
        if (isModalVisible) {
            closeModal();
        } else {
            showModal();
        }
    };

    const closeModal = () => {
        setIsModalVisible(false);

        setTimeout(() => {
            setIsModalRendered(false);
        }, 300);
    };

    return {
        isModalVisible,
        isModalRendered,
        showModal,
        toggleModal,
        closeModal,
    };
};

export default useModal;
