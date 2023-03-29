import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import style from './SpecificOrder.module.css';
import Loader from '../components/loader/Loader';
import Icon from "../icons/Icon";
import useModal from '../hooks/use-Modal';
import Modal from '../components/modal/Modal';

const SpecificOrder = () => {

    const {id: orderId} = useParams();
    const [resultOrder, setResultOrder] = useState();
    const [orderItems, setOrderItems] = useState([]);
    const [items, setItems] = useState([]);

    const {
        isShown: isShownAddModal,
        hide: hideAddModal,
        show: showAddModal
    } = useModal();

    const loadOrder = async () => {

        const response = await fetch("http://192.168.50.62:8080/order/" + orderId, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token: localStorage.getItem("token")}) 
        });
        const json = await response.json();
        console.log(json);

        const responseItems = await fetch("http://192.168.50.62:8080/item/get", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token: localStorage.getItem("token")}) 
        });
        const jsonItems = await responseItems.json();
        console.log(jsonItems);

        setResultOrder(json.data); 
        setOrderItems(json.data.OrderItems);
        setItems(jsonItems.data);
    }

    useEffect(() => {
        loadOrder();
    }, []);

    const addItemOnClickHandler = () => {
        showAddModal();
    }

    if (resultOrder !== undefined) {
        
        let replacedCreatedDate = resultOrder.createdAt.replace('T', ' ');
        replacedCreatedDate = replacedCreatedDate.replace('.000Z', '');
           
        let replacedClosedDate = "-";
        if (resultOrder.closed !== null) {
            replacedClosedDate = resultOrder.closed.replace('T', ' ');
            replacedClosedDate = replacedClosedDate.replace('.000Z', '');
        }
        
        let status = <span className={style.ticketCreated}>Created</span>;
        if (resultOrder.closed !== null) {
            status = <span className={style.ticketClosed}>Closed</span>;
        }

        let direction = <span className={style.cin} title='ORDER IN'><Icon size='20' icon='orderin'/> (ORDER IN)</span>;
        if (resultOrder.Direction.id === 2) {
            direction = <span className={style.cout} title='ORDER OUT'><Icon size='20' icon='orderout'/> (ORDER OUT)</span>;
        } 

        let itemsJSX = <tr><td colSpan={7}></td></tr>;
        if (orderItems.length > 0) {
            itemsJSX = orderItems.map((item) => {
                return (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.Item.barcode}</td>
                        <td>{item.Item.name}</td>
                        <td>{item.Shelf.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.Item.Measure.name}</td>
                        <td>
                            <button className={style.btnEdit} onClick={()=>{}}><Icon size='20' icon='edit'/></button>
                            <button className={style.btnDelete} onClick={()=>{}}><Icon size='20' icon='xmark'/></button>
                        </td>
                    </tr>
                );
            });
        } 

        let itemOptions = [<option value='0'>Chose an item...</option>];
        if (items.length > 0) {
            items.forEach((item) => {
                itemOptions.push(<option value={item.id}>{item.name}</option>);
            });
        }

        //!const levelsClass = shelfLevelHasError ? style.invalid : ""; 

        const addModal = (
            <Modal onClose={hideAddModal}>
                <h3 className={style.mt0}>Add item</h3>
                <div className={`${style.inputGroup}`}>
                    <label>Items</label>
                    <select>{itemOptions}</select>
                    <p>The field cannot be empty</p>
                </div>
                <div className={style.formBtns}>
                    <button className={`${style.btn} ${style.btnSuccess}`} onClick={()=>{}}>Add item</button>
                    <button className={`${style.btn} ${style.btnDefault}`} onClick={hideAddModal}>Cancel</button>
                </div>
            </Modal>
        );
    
        return (
            <div className={style.container}>
                {isShownAddModal && addModal}
                <div className={style.box}>
                    <div className={style.floatR}>
                        <button className={`${style.btn} ${style.btnSuccess}`} onClick={addItemOnClickHandler}>Add item</button>
                        <button className={`${style.btn}`} disabled={orderItems.length === 0}>Close</button>                                          
                        <button className={`${style.btn} ${style.btnDanger}`}>Delete order</button>
                    </div>
                    <h3 className={style.mt0}>Order ({resultOrder.id})</h3>
                    <div className={style.datas}>
                        <div>
                            <div className={style.direction}>
                                <p><b>Direction:</b> </p>{direction}
                            </div>
                            <p><b>Created by:</b> {`${resultOrder.User.lastName} ${resultOrder.User.firstName}`}</p>
                        </div>
                        <div>
                            <p><b>Created at:</b> {replacedCreatedDate}</p>
                            <p><b>Closed at:</b> {replacedClosedDate}</p>
                            <p><b>Status:</b> {status}</p>
                        </div>
                    </div>
                    <hr></hr>
                    <table className={style.items}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Barcode</th>
                                <th>Item</th>
                                <th>Shelf</th>
                                <th>Quantity</th>
                                <th>Measure</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemsJSX}                                                                          
                        </tbody>
                    </table>                  
                </div>
            </div>
        );
    } else {
        return (<Loader />);
    }
}

export default SpecificOrder;