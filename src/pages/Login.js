import { useState } from 'react';
import style from './Login.module.css';
import useInput from '../hooks/use-Input';
import { Navigate, redirect, useNavigate } from 'react-router-dom';

const Login = () => {

    const token = localStorage.getItem("token");

    const [wrongUsername, setWrongUsername] = useState(false);
    const [wrongMessage, setWrongMessage] = useState(false);

    const {
        value: usernameEnteredValue,
        isValid: usernameIsValid,
        hasError: usernameHasError,
        changeHandler: usernameChangeHandler,
        blurHandler: usernameBlurHandler,
        reset: usernameReset,
    } = useInput(value => value.trim() !== "");

    const {
        value: pwdEnteredValue,
        isValid: pwdIsValid,
        hasError: pwdHasError,
        changeHandler: pwdChangeHandler,
        blurHandler: pwdBlurHandler,
        reset: pwdReset,
    } = useInput(value => {return value.trim() !== "" || value.trim().lenght > 7});

    const submitHandlerLogin = async (event) => {
        event.preventDefault();     
        
        usernameBlurHandler();
        pwdBlurHandler();

        if (!usernameIsValid || !pwdIsValid) {
            return;
        }

        const response = await fetch("http://192.168.50.62:8080/user/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: usernameEnteredValue, password: pwdEnteredValue}) 
        });
        const json = await response.json();
        console.log(json);
        if (json.data !== undefined) {

            for (const key in json.data) {
                if (key !== "ownPw") {
                    localStorage.setItem(key, json.data[key]);
                }
            }
      
            setWrongUsername(false);
            usernameReset();
            pwdReset();

            if (!json.data.ownPw) {
                console.log("SET NEW PASS");
            } 
        } else {
            setWrongMessage(json.message);
            setWrongUsername(true);         
        } 
    };

    const inputUsernameClass = usernameHasError ? style.invalid : "";
    const inputPasswdClass = pwdHasError ? style.invalid : "";

    if (token !== null) {
        return <Navigate to='/' />
    }

    return (
        <div className={style.center}>
            <form className={style.login} onSubmit={submitHandlerLogin}>
                
                <h3>Log in</h3>
                <div className={`${style["input-group"]} ${inputUsernameClass}`}>
                    <label>Username</label>
                    <input type='text' placeholder='Username...' onInput={usernameChangeHandler} onBlur={usernameBlurHandler} value={usernameEnteredValue}/>
                </div>
                <div className={`${style["input-group"]} ${style.mt} ${inputPasswdClass}`}>
                    <label>Password</label>
                    <input type='password' placeholder='Password...' onInput={pwdChangeHandler} onBlur={pwdBlurHandler} value={pwdEnteredValue}/>
                </div>
                {wrongUsername && <div><p className={style.wrongCreds}>{wrongMessage}!</p></div>}             
                <div className={`${style["button-group"]} ${style.mt}`}>
                    <button className={style["btn-login"]}>Log in</button>
                </div>
                <p><a href='https://www.youtube.com/'>Forget password?</a></p>
                <p>Don't have an account? <a href='https://www.youtube.com/'>Register</a></p>
            </form>
        </div>
    );
}

export default Login;