import { useState, useEffect } from "react";
import TimerContext from "./timer-context";
import { useNavigate } from "react-router-dom";

const TimerProvider = (props) => {

    const navigate = useNavigate();

    const onLogoutHandler = () => {
        localStorage.clear();
        navigate('/login');
    }

    const defaultTimerValue = 600;
    const [seconds, setSeconds] = useState(defaultTimerValue);
    useEffect(() => {
        const intervalId = setInterval(() => {     
            setSeconds(seconds => seconds - 1);
        }, 1000); 
        

        return () => clearInterval(intervalId);
    }, []);

    if (seconds < 0) {
        onLogoutHandler();
    }

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
        console.log(json); 
    }
    //console.log(actualTime);
    if (tokenExpire < actualTime.getTime()) {
        console.log("BIGGER");
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