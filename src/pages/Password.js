import { useSearchParams, useNavigate, useNavigation, useActionData, Form, json} from "react-router-dom";
import { Fragment, useState, useEffect } from "react";
import style from './Password.module.css';
import useInput from '../hooks/use-Input';
import { toast } from 'react-toastify';

const Password = () => {

    const navigate = useNavigate();

    let [searchParams, setSearchParams] = useSearchParams();
    const [isFirstLogin, setIsFirstLogin] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const {
        value: oldPassEnteredValue,
        isValid: oldPassIsValid,
        hasError: oldPassHasError,
        changeHandler: oldPassChangeHandler,
        blurHandler:oldPassBlurHandler,
        reset: oldPassReset,
    } = useInput(value => value.trim() !== "");

    const {
        value: newPassEnteredValue,
        isValid: newPassIsValid,
        hasError: newPassHasError,
        changeHandler: newPassChangeHandler,
        blurHandler: newPassBlurHandler,
        reset: newPassReset,
    } = useInput(value => value.trim() !== "" && value.trim().length > 7);

    const {
        value: newPassReEnteredValue,
        isValid: newPassReIsValid,
        hasError: newPassReHasError,
        changeHandler: newPassReChangeHandler,
        blurHandler: newPassReBlurHandler,
        reset: newPassReReset,
    } = useInput(value => value.trim() !== "" && value.trim().length > 7);

    const onOldPassChangeHandler = (event) => {
        oldPassChangeHandler(event);
        setErrorMessage("");
    }

    const onNewPassChangeHandler = (event) => {
        newPassChangeHandler(event);
        setErrorMessage("");
    }

    const onNewPassReChangeHandler = (event) => {
        newPassReChangeHandler(event);
        setErrorMessage("");
    }

    const onFormSubmitHandler = async (event) => {
        event.preventDefault();
        
        oldPassBlurHandler();
        newPassBlurHandler();
        newPassReBlurHandler();
        
        
        if (!oldPassIsValid || !newPassIsValid || !newPassReIsValid) {
            return;
        } 

        if (newPassEnteredValue !== newPassReEnteredValue) {
            setErrorMessage("New password and confirm new password must match");
            return;
        }

        const username = localStorage.getItem("username");
        const response = await fetch("http://192.168.50.62:8080/user/password", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token: localStorage.getItem("token"), username: username, oldpass: oldPassEnteredValue, newpass: newPassEnteredValue}) 
        });
        const json = await response.json();

        if (response.ok) {
            
            toast.success('Password changed successfully', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            navigate("/");
            
        } else {
            setErrorMessage(json.message);
        }
    }

    useEffect(() => {
        if (searchParams.get("notOwn") === "true") {
            setIsFirstLogin(true);
        }
        
    }, [isFirstLogin]);

    const inputOldPwClass = oldPassHasError ? style.invalid : "";
    const inputNewPwClass = newPassHasError ? style.invalid : "";
    const inputReNewPwClass = newPassReHasError ? style.invalid : "";


    return (
        <Fragment>
            {isFirstLogin && <p className={style.warning}>This is your first login or eather your password was reset. Please change your password!</p>}
            <div className={style.changePass}>
                <form onSubmit={onFormSubmitHandler}>                  
                    <h3>Change password</h3>
                    <div className={`${style.inputGroup} ${inputOldPwClass}`}>
                        <label>Old password</label>
                        <input type='password' onInput={onOldPassChangeHandler} onBlur={oldPassBlurHandler} value={oldPassEnteredValue}/>
                        <p>The field cannot be empty</p>
                    </div>
                    <div className={`${style.inputGroup} ${inputNewPwClass}`}>
                        <label>New password</label>
                        <input type='password' onInput={onNewPassChangeHandler} onBlur={newPassBlurHandler} value={newPassEnteredValue}/>
                        <p>The field cannot be empty and must have at least 7 characters</p>
                    </div>
                    <div className={`${style.inputGroup} ${inputReNewPwClass}`}>
                        <label>Confirm new password</label>
                        <input type='password' onInput={onNewPassReChangeHandler} onBlur={newPassReBlurHandler} value={newPassReEnteredValue}/>
                        <p>The field cannot be empty and must have at least 7 characters</p>
                    </div>
                    {errorMessage !== "" && <p className={style.pMatch}>{errorMessage}</p>}
                    <div className={style.formBtns}>
                        <button className={style.btn}>Change password</button>
                    </div>
                </form>
            </div>
        </Fragment>
    );
}

export default Password;