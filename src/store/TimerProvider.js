import { useState, useEffect } from "react";
import TimerContext from "./timer-context";
import { useNavigate } from "react-router-dom";

const UserProvider = (props) => {

    const navigate = useNavigate();

    const onLogoutHandler = () => {
        localStorage.clear();
        navigate('/login');
    }

    const defaultTimerValue = 10;
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

export default UserProvider;