import { Fragment } from "react";
import Icon from "../../icons/Icon";
import style from "./Admins.module.css";

const Admins = (props) => {

    let jsx = props.admins.data.map((admin, index) => {
        return (
            <div key={index} className={style.admin}>
                <div>
                    <Icon size='20' icon='user' />{admin.fullName}
                </div>
                <div>
                    <Icon size='20' icon='envelope' />{admin.email}
                </div>
                <div>
                    <Icon size='20' icon='phone' />{admin.phone}
                </div>
            </div>
        );
    });
    return (
        <Fragment>
            {jsx}
        </Fragment>
    );
}

export default Admins;