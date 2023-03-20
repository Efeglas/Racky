import style from './TopNavigation.module.css';
import Icon from '../icons/Icon';
import {useState, useEffect, useContext} from 'react';
import TimerContext from '../store/timer-context';

const TopNavigation = (props) => {

    const timerCtx = useContext(TimerContext);
    let topNavClass = style["top-nav"];
    if (props.isOpen) {
        topNavClass = `${style["top-nav"]} ${style.open}`;
    }

    const convertTime = (seconds) =>  {
        
        const leadingZero = (seconds) => {
          return seconds < 10 ? "0" + seconds : seconds;
        };
        // Calculate minutes and seconds from input
        var minutes = leadingZero(Math.floor(seconds / 60));
        var seconds = leadingZero(Math.floor(seconds % 60));
        // Return the formatted string
        return minutes + ":" + seconds;
    };

    return (
        <div className={topNavClass}>             
            <div onClick={props.onOpen}>
                <Icon size='20' icon='bars' />
            </div>
            <div className={style.timer}>
                Kijelentkezés: {convertTime(timerCtx.seconds)}
            </div>
        </div>
    );
}

export default TopNavigation;