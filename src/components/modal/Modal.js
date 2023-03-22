import style from './Modal.module.css';
import {Fragment} from 'react';
import ReactDOM from 'react-dom';

const Backdrop = (props) => {
    return (
        <div className={style.backdrop} onClick={props.onClose}></div>
    );
}

const ModalOverlay = (props) => {
    return (
        <div className={style.modal}>
            <div className={style.content}>
                {props.children}
            </div>
        </div>
    );
}

const portalElement = document.getElementById("overlays");

const Modal = (props) => {
    return (
        <Fragment>
            {ReactDOM.createPortal(<Backdrop onClose={props.onClose}/>, portalElement)}
            {ReactDOM.createPortal(<ModalOverlay>{props.children}</ModalOverlay>, portalElement)}
        </Fragment>
    );
}
export default Modal;