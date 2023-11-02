import { createPortal } from "react-dom";
import Overlay from "./Overlay.jsx";

const Modal = ({ children, isOpen, onClose }) => {
    return createPortal(
        <Overlay
            isVisible={true}
            transition
            center
            onClick={onClose}
            className="z-index-900"
        >
            <div className="wrapper">
                <div className="radius-1 max-w-xl w-full mx-auto bg-zinc-900 mt-m transition-fade-up">
                    {children}
                </div>
            </div>
        </Overlay>,
        document.getElementById("modal")
    );
};

export default Modal;
