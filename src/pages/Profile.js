import { Fragment, Suspense } from "react";
import { Link, defer, Await, json, useLoaderData } from "react-router-dom";
import style from './Profile.module.css';
import Loader from "../components/loader/Loader";

const Profile = () => {

    const {userdata} = useLoaderData();
    console.log(userdata);
    return (
        <Fragment>
                <Suspense fallback={<Loader />}>
                    <Await resolve={userdata} errorElement={<p>Cant't load data...</p>} children={
                        (loadedData) => {
                            return (
                                <div className={style.container}>
                                    <div className={style.profile}>
                                        <h3>User personal data</h3>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>Username</td>
                                                    <td>{loadedData.data.username}</td>
                                                </tr>
                                                <tr>
                                                    <td>Role</td>
                                                    <td>{loadedData.data.Role.name}</td>
                                                </tr>
                                                <tr>
                                                    <td>Full name</td>
                                                    <td>{`${loadedData.data.lastName} ${loadedData.data.firstName}`}</td>
                                                </tr>
                                                <tr>
                                                    <td>Email</td>
                                                    <td>{loadedData.data.email}</td>
                                                </tr>
                                                <tr>
                                                    <td>Phone</td>
                                                    <td>{loadedData.data.phone}</td>
                                                </tr>
                                                <tr>
                                                    <td>Jelszó</td>
                                                    <td><Link to='/password'>Change password</Link></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            );
                        }
                    }/>
                </Suspense>          
        </Fragment>
    );
}

const loadUserData = async () => {

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const response = await fetch("http://192.168.50.62:8080/user", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId: userId, token: token}) 
    });

    if (!response.ok) {
        return json({message: 'Could not fetch info from admins.'}, {status: 500});
    } else {
        const json = await response.json();
        console.log(json);
        return json;
    } 
}

export const loader = () => {
    return defer({
        userdata: loadUserData(),
    });
}

export default Profile;