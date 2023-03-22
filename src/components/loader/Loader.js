import { Fragment } from 'react';
import Icon from '../../icons/Icon';
import style from './Loader.module.css';
import ReactDOM from 'react-dom';


    
const Loader = () => {

    const portalElement = document.getElementById("overlays");

    return (
        <Fragment>
            {ReactDOM.createPortal(<div className={style.loader}>
                <Icon size='50' icon='spinner'/>
            </div>, portalElement)}
        </Fragment>
    );
}
export default Loader;