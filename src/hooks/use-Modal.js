import { useState } from "react";

const useModal = () => {

    const [isShown, setIsShown] = useState(false);

    const hide = () => {
        setIsShown(false);
    }

    const show = () => {
        setIsShown(true);
    }

    return {
        isShown: isShown,
        hide: hide,
        show: show
    };
   
}

export default useModal;