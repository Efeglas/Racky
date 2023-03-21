import { NavLink } from 'react-router-dom';
import PrivateLink from './PrivateLink';
import React from 'react';

import style from './SideNavigation.module.css';
import Icon from '../icons/Icon';

const SideNavigation = (props) => {

    let sideNavClass = style["side-nav"];
    if (props.isOpen) {
        sideNavClass = `${style["side-nav"]} ${style.open}`;
    }

    return (
      <aside className={sideNavClass}>
        <div>
            <div>
                <Icon size='20' icon='warehouse'/>
                <h3>Racky</h3>
            </div>
            <div className={style.pS} onClick={props.onOpen}>              
                <Icon size='20' icon='xmark'/>
            </div>
        </div>
        <ul>    
          <li onClick={props.onOpen}>
              <NavLink to="/profile">Profile</NavLink>
            </li>     
          <PrivateLink permission={[1]}>
            <li onClick={props.onOpen}>
              <NavLink to="/users">Users</NavLink>
            </li>
          </PrivateLink>
          <PrivateLink permission={[1]}>
            <li onClick={props.onOpen}>
              <NavLink to="/roles">Roles</NavLink>
            </li>
          </PrivateLink>
          <li onClick={props.onLogout}>
            <button type='button'>Logout</button>
          </li>
        </ul>
      </aside>
    );
}

export default React.memo(SideNavigation);