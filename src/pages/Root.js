import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

import SideNavigation from "../components/SideNavigation";
import TopNavigation from "../components/TopNavigation";
import style from './Root.module.css';
import TimerProvider from '../store/TimerProvider';

const Root = () => {

  const navigate = useNavigate();

  const onLogoutHandler = () => {
    localStorage.clear();
    navigate('/login');
  }

    const { pathname } = useLocation();
    const [sideNavOpen, setSideNavOpen] = useState(false);

    const resetTimer = useCallback(() =>{
      //setSeconds(defaultTimerValue);
    })

    const sideNavToggleHandler = useCallback(() => {
      setSideNavOpen(!sideNavOpen);
      resetTimer();
    })


    let outletClass = style.outlet;
    if (sideNavOpen) {
        outletClass = `${style.outlet} ${style.open}`;
    }

    return (
        <TimerProvider>
            {pathname !== `/login` && <SideNavigation isOpen={sideNavOpen} onOpen={sideNavToggleHandler} onLogout={onLogoutHandler}/>}
            {pathname !== `/login` && <TopNavigation isOpen={sideNavOpen} onOpen={sideNavToggleHandler} onLogout={onLogoutHandler}/>}           
            <main className={outletClass}>
              <Outlet />
            </main>
        </TimerProvider>
    );
}

export default Root;