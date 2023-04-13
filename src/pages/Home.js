import { Fragment, useState, useEffect } from 'react';
import style from './Home.module.css';
import Icon from '../icons/Icon';

const Home = () => {

    const firstName = localStorage.getItem("firstName");

    const [resultHome, setResultHome] = useState({});

    const loadHome = async () => {
        
        const response = await fetch("http://192.168.50.62:8080/inventory/home", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token: localStorage.getItem("token")}) 
        });
        const json = await response.json();
        setResultHome(json.data);
    }

    useEffect(() => {
        loadHome();
    }, []);

    const event = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return (
        <Fragment>  
        <h2>Welcome to Racky {firstName}!</h2>
        <div className={style.box}>
            <h3 className={style.mt0}>Introduction</h3>
            <p>
                Welcome to our warehouse management web application! Our application provides many features to fully manage 
                your warehouse. You can plan multiple layouts with shelf placement. You can manage your inventory. You can manage
                inventory movement and access statistics. There is a wide role and permission system built in so you can manipulate witch part of the application is 
                accessable to users. 
            </p>
            <p>We hope you enjoy using our software!</p>
            <p><b>Racky developement team!</b></p>
        </div>
        <div className={style.flex}>
            <div className={style.cB}>
                <div><Icon size='70' icon='weight' /></div>
                <div>
                    <p>Weight of items</p>
                    <p>{resultHome.kg} kg</p>
                </div>
            </div>
            <div className={style.cD}>
                <div><Icon size='70' icon='glasswater' /></div>
                <div>
                    <p>Liter of fluid</p>
                    <p>{resultHome.l} l</p>
                </div>
            </div>
            <div className={style.cG}>
                <div><Icon size='70' icon='ruler' /></div>
                <div>
                    <p>Meter of products</p>
                    <p>{resultHome.m} m</p>
                </div>
            </div>
            <div className={style.cGS}>
                <div><Icon size='70' icon='puzzle' /></div>
                <div>
                    <p>Piece of goods</p>
                    <p>{resultHome.pcs} pcs</p>
                </div>
            </div>
        </div>
        <div className={style.flex}>
            <div className={style.cGS}>
                <div><Icon size='70' icon='orderout' /></div>
                <div>
                    <p>Orders sent</p>
                    <p>{resultHome.orderout}</p>
                </div>
            </div>
            <div className={style.cB}>
                <div><Icon size='70' icon='user' /></div>
                <div>
                    <p>Active users</p>
                    <p>{resultHome.user}</p>
                </div>
            </div>
            <div className={style.cG}>
                <div><Icon size='70' icon='orderin' /></div>
                <div>
                    <p>Orders in</p>
                    <p>{resultHome.orderin}</p>
                </div>
            </div>
        </div>
        <p className={style.data}>{event.toLocaleDateString('en-HU', options)}</p>
        </Fragment>
    );
}

export default Home;