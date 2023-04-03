import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

import SideNavigation from "../components/SideNavigation";
import TopNavigation from "../components/TopNavigation";
import style from './Root.module.css';
import TimerProvider from '../store/TimerProvider';
import useCustomFetch from "../hooks/use-CustomFetch";

const Root = () => {

  const navigate = useNavigate();
  const customFetch = useCustomFetch();

  const onLogoutHandler = () => {

    const data = {username: localStorage.getItem("username")};
    
    customFetch("/user/logout", data, "POST", ()=>{}, ()=>{}); 
        

    localStorage.clear();
    navigate('/login');
  }

    const { pathname } = useLocation();
    const [sideNavOpen, setSideNavOpen] = useState(false);

    const resetTimer = () =>{
      //setSeconds(defaultTimerValue);
    }

    const sideNavToggleHandler = () => {
      setSideNavOpen(!sideNavOpen);
      resetTimer();
    }


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