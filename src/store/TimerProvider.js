import { useState, useEffect } from "react";
import TimerContext from "./timer-context";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const TimerProvider = (props) => {

    const navigate = useNavigate();

    const onLogoutHandler = () => {
        localStorage.clear();
        navigate('/login');
        return;
    }

    const defaultTimerValue = 600;
    const [seconds, setSeconds] = useState(defaultTimerValue);
    useEffect(() => {
        const intervalId = setInterval(() => {     
            setSeconds(seconds => seconds - 1);          
        }, 1000); 
        
        const onEveryClickOnDom = () => {
            setSeconds(defaultTimerValue);
        }
        document.addEventListener('click', onEveryClickOnDom);

        if (seconds < 0) {
            onLogoutHandler();
        }

        return () => {
            clearInterval(intervalId);
            document.removeEventListener('click', onEveryClickOnDom);
        };
    }, [seconds]);

    

    const tokenExpire = Number(localStorage.getItem("tokenExpire"));
    const actualTime = new Date();
    //console.log(tokenExpire, actualTime.getTime());
    const refreshToken = async () => {
        const response = await fetch("http://192.168.50.62:8080/token", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: localStorage.getItem('username'), refreshToken: localStorage.getItem('refreshToken')}) 
        });
        const json = await response.json();

        if (response.ok) {           
            if (json.data !== undefined) {
                localStorage.setItem('token', json.data.token);
                localStorage.setItem('refreshToken', json.data.refreshToken);
                localStorage.setItem('tokenExpire', json.data.tokenExpire);
            }
        } else {
            toast.error("Can't refresh token", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
            onLogoutHandler();
        }        
    }
  
    if (tokenExpire !== null && tokenExpire < actualTime.getTime()) {      
        refreshToken();    
    }

    const reset = () => {
        setSeconds(defaultTimerValue);
    }

    const timerContext = {
        seconds: seconds,
        reset: reset
    };
    
    return (
        <TimerContext.Provider value={timerContext}>
            {props.children}
        </TimerContext.Provider>
    );
}

export default TimerProvider;