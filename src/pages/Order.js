import { Fragment, useState, useEffect } from 'react';
import style from './Order.module.css';
import { useNavigate } from 'react-router-dom';
import OrderTable from '../components/OrderTable';
import Icon from '../icons/Icon';
import useToast from '../hooks/use-Toast';

const Order = () => {

    const [resultOrders, setResultOrders] = useState([]);
    const navigate = useNavigate();

    const fireToast = useToast();

    const loadOrders = async () => {

        const response = await fetch("http://192.168.50.62:8080/order", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token: localStorage.getItem("token")}) 
        });
        const json = await response.json();
        console.log(json);
        setResultOrders(json.data); 
    }

    const createOrderIn = async () => {

        const response = await fetch("http://192.168.50.62:8080/order/in", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token: localStorage.getItem("token")}) 
        });
        const json = await response.json();
        console.log(json);
        navigate('/order/' + json.data.id);
        fireToast('Order created (IN)');      
    }

    const createOrderOut = async () => {

        const response = await fetch("http://192.168.50.62:8080/order/out", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token: localStorage.getItem("token")}) 
        });
        const json = await response.json();
        console.log(json);
        navigate('/order/' + json.data.id);
        fireToast('Order created (OUT)');        
    }

    useEffect(() => {
        loadOrders();
    }, []);

    return (
        <Fragment>
            <div className={style.orderBtns}>
                <button className={style.btn} onClick={createOrderIn}><Icon size='20' icon='orderin' /> Create Order in</button>
                <button className={style.btn} onClick={createOrderOut}>Create Order out <Icon size='20' icon='orderout' /></button>
            </div>
            <OrderTable orders={resultOrders}/>           
        </Fragment>
    );
}

export default Order;