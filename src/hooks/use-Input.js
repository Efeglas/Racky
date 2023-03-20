import { useState } from "react";

const useInput = (validateValue) => {

    const [enteredValue, setEnteredValue] = useState('');
    const [touched, setTouched] = useState(false);

    const isValid = validateValue(enteredValue);
    const hasError = !isValid && touched;

    const inputChangeHandler = (event) => {
        setEnteredValue(event.target.value);
    }

    const inputBlurHandler = () => {
        setTouched(true);
    }

    const reset = () => {
        setEnteredValue('');
        setTouched(false);
    }

    return {
        value: enteredValue,
        isValid: isValid,
        hasError: hasError,
        changeHandler: inputChangeHandler,
        blurHandler: inputBlurHandler,
        reset: reset
    };
}

export default useInput;