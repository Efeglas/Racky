import { Fragment, Suspense } from "react";
import { defer, Await, useLoaderData, json } from "react-router-dom";
import Loader from "../components/loader/Loader";
import style from './UserInfo.module.css';
import Admins from "../components/userInfo/Admins";

const UserInfo = () => {

    const {data} = useLoaderData();

    return (
        <Fragment>
            <div className={style.container}>
                <div className={style.info}>
                    <h3>Registration or request a password change</h3>
                    <p>If you are new to the system and would like to <b>request a user</b>, <b>reset your password</b> or have any questions about the system, please contact one of the admins below.</p>
                </div>
                <Suspense fallback={<Loader />}>
                    <Await resolve={data} errorElement={<p className={style.box}>Cant't load data...</p>} children={
                        (loadedData) => {return <Admins admins={loadedData}/>}
                    }/>
                </Suspense>
            </div>
        </Fragment>
    );
}

const loadeAdmins = async () =>{

    const response = await fetch("http://192.168.50.62:8080/info");

    if (!response.ok) {
        return json({message: 'Could not fetch info from admins.'}, {status: 500});
    } else {
        const json = await response.json();
        console.log(json);
        return json;
    } 
} 

export const loader = async () => {
    return defer({
        data: loadeAdmins(),
    });
}

export default UserInfo;