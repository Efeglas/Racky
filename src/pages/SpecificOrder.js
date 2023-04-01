import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, Fragment } from "react";
import style from './SpecificOrder.module.css';
import Loader from '../components/loader/Loader';
import Icon from "../icons/Icon";
import useModal from '../hooks/use-Modal';
import Modal from '../components/modal/Modal';
import useInput from "../hooks/use-Input";
import useCustomFetch from '../hooks/use-CustomFetch';
import useToast from '../hooks/use-Toast';

const SpecificOrder = () => {

    const {id: orderId} = useParams();
    const [resultOrder, setResultOrder] = useState();
    const [orderItems, setOrderItems] = useState([]);
    const [items, setItems] = useState([]);
    const [shelves, setShelves] = useState([]);
    const [orderIsClosed, setOrderIsClosed] = useState(false);

    const [selectedShelf, setSelectedShlef] = useState(0);
    const [selectedShelfLevel, setSelectedShlefLevel] = useState(0);
    const [selectedItem, setSelectedItem] = useState(0);
    const [selectedItemMeasure, setSelectedItemMeasure] = useState("-");

    const [selectedOrderItem, setSelectedOrderItem] = useState({});
    const [isEdit, setIsEdit] = useState(false);

    const [deletingOrder, setDeletingOrder] = useState(false);

    const [closeErrorArray, setCloseErrorArray] = useState([]);

    const customFetch = useCustomFetch();
    const fireToast = useToast();
    const navigate = useNavigate();

    const {
        isShown: isShownAddModal,
        hide: hideAddModal,
        show: showAddModal
    } = useModal();

    const {
        isShown: isShownDeleteModal,
        hide: hideDeleteModal,
        show: showDeleteModal
    } = useModal();

    const {
        isShown: isShownCloseModal,
        hide: hideCloseModal,
        show: showCloseModal
    } = useModal();

    const {
        isShown: isShownErrorModal,
        hide: hideErrorModal,
        show: showErrorModal
    } = useModal();

    const {
        value: qtyEnteredValue,
        setValue: setqtyEnteredValue,
        isValid: qtyIsValid,
        hasError: qtyHasError,
        changeHandler: qtyChangeHandler,
        blurHandler:qtyBlurHandler,
        reset: qtyReset,
    } = useInput(value => value.toString().trim() !== "");

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

        const responseShelves = await fetch("http://192.168.50.62:8080/layout/shelves/all", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token: localStorage.getItem("token")}) 
        });
        const jsonShelves = await responseShelves.json();
        console.log(jsonShelves);

        setResultOrder(json.data); 
        setOrderItems(json.data.OrderItems);
        setItems(jsonItems.data);
        setShelves(jsonShelves.data);

        if (json.data.closed !== null) {
            
            setOrderIsClosed(true);
        }
    }

    const loadOrderItems = async () => {

        const response = await fetch("http://192.168.50.62:8080/order/" + orderId + "/orderitems", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token: localStorage.getItem("token")}) 
        });
        const json = await response.json();
        console.log(json);
        setOrderItems(json.data);
    }

    useEffect(() => {
        loadOrder();
    }, []);

    const addItemOnClickHandler = () => {
        setIsEdit(false);
        setSelectedItem(0);
        setSelectedShlef(0);
        setSelectedShlefLevel(0);
        setSelectedItemMeasure("-");
        qtyReset();
        showAddModal();
    }

    const addItemToDBClickHandler = async () => {
       
        const data = {
            token: localStorage.getItem("token"), 
            order: orderId,             
            item: selectedItem,
            shelf: selectedShelf,
            shelflevel: selectedShelfLevel,
            quantity: qtyEnteredValue,
        };

        const afterSuccess = () => {
            setSelectedItem(0);
            setSelectedShlef(0);
            setSelectedShlefLevel(0);
            setSelectedItemMeasure("-");
            qtyReset();
            loadOrderItems();
        }
        const generalEnd = () => {hideAddModal();}

        customFetch("/order/orderitem/add", data, "POST", afterSuccess, generalEnd); 
     /*    const response = await fetch("http://192.168.50.62:8080/order/orderitem/add", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"), 
                order: orderId,             
                item: selectedItem,
                shelf: selectedShelf,
                shelflevel: selectedShelfLevel,
                quantity: qtyEnteredValue,
            }) 
        });
        const json = await response.json();
        console.log(json);

        if (response.ok) {
            toast.success('Order item added', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setSelectedItem(0);
            setSelectedShlef(0);
            setSelectedShlefLevel(0);
            setSelectedItemMeasure("-");
            qtyReset();
            loadOrderItems();
        } else {
            toast.error(json.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }        
        hideAddModal(); */
    }

    const editItemToDBClickHandler = async () => {

        const data = {
            token: localStorage.getItem("token"), 
            order: orderId,             
            item: selectedItem,
            shelf: selectedShelf,
            shelflevel: selectedShelfLevel,
            quantity: qtyEnteredValue,
        };

        const afterSuccess = () => {loadOrderItems();}
        const generalEnd = () => {hideAddModal();}

        customFetch("/order/orderitem/edit", data, "PATCH", afterSuccess, generalEnd); 
      /*   const response = await fetch("http://192.168.50.62:8080/order/orderitem/edit", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"), 
                order: orderId,             
                item: selectedItem,
                shelf: selectedShelf,
                shelflevel: selectedShelfLevel,
                quantity: qtyEnteredValue,
            }) 
        });
        const json = await response.json();
        console.log(json);

        if (response.ok) {
            toast.success('Order item edited', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            
            loadOrderItems();
        } else {
            toast.error(json.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }        
        hideAddModal(); */
    }

    const selectItemChangeHandler = (event) => {
        setSelectedItem(event.target.value);
        const item = items.find((item) => {
            if (item.id == event.target.value) {
                return true;
            }
            return false;
        })
        setSelectedItemMeasure(item.Measure.name);
    }

    const selectShelfChangeHandler = (event) => {
        setSelectedShlefLevel(0);  
        setSelectedShlef(event.target.value);
    }

    const selectShelfLevelChangeHandler = (event) => {
        setSelectedShlefLevel(event.target.value);
    }

    const deleteOrderItemFromDBClickHandler = async () => {
        
        const data = {
            token: localStorage.getItem("token"), 
            orderitem: selectedOrderItem.id,                            
        };

        const afterSuccess = () => {loadOrderItems();}
        const generalEnd = () => {hideDeleteModal();}

        customFetch("/order/orderitem/delete", data, "DELETE", afterSuccess, generalEnd); 

        /* const response = await fetch("http://192.168.50.62:8080/order/orderitem/delete", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"), 
                orderitem: selectedOrderItem.id,                            
            }) 
        });
        const json = await response.json();
        console.log(json);

        if (response.ok) {
            toast.success('Order item deleted', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });          
            loadOrderItems();
        } else {
            toast.error(json.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }        
        hideDeleteModal(); */
    }

    const initDeleteOrderHandler = () => {
        setDeletingOrder(true);
        showDeleteModal();
    }

    const deleteOrderFromDBHandler = async () => {

        const data = {
            token: localStorage.getItem("token"), 
            order: orderId,                            
        };

        const afterSuccess = () => {navigate('/order');}
        const generalEnd = () => {hideDeleteModal();}

        customFetch("/order/delete", data, "DELETE", afterSuccess, generalEnd); 

        /* const response = await fetch("http://192.168.50.62:8080/order/delete", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"), 
                order: orderId,                            
            }) 
        });
        const json = await response.json();
        console.log(json);

        if (response.ok) {
            toast.success('Order deleted', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });          
            navigate('/order');
        } else {
            toast.error(json.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }        
        hideDeleteModal(); */
    }

    const closeOrderClickHandler = () => {
        showCloseModal();
    }

    const closeOrderHandler = async () => {

        const response = await fetch("http://192.168.50.62:8080/order/close", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"), 
                order: orderId,                            
            }) 
        });
        const json = await response.json();
        console.log(json);

        if(json.error !== undefined && json.error.length > 0) {
            setCloseErrorArray(json.error);
            hideCloseModal();
            showErrorModal();
        } else {

            if (response.ok) {
                fireToast('Order closed');                         
                 loadOrder();
             } else {
                fireToast(json.message, 'error');                
             }        
             hideCloseModal();
        }

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

        const editOrderItemClickHandler = (orderitem) => {   
               
            setIsEdit(true);
            setSelectedItem(orderitem.Item.id);
            setSelectedOrderItem(orderitem);
            setSelectedItemMeasure(orderitem.Item.Measure.name);
            setSelectedShlef(orderitem.Shelf.id);  
            setSelectedShlefLevel(orderitem.shelflevel);         
            setqtyEnteredValue(orderitem.quantity);
            showAddModal();
        }

        const deleteOrderItemClickHandler = (orderitem) => {
            setSelectedOrderItem(orderitem);
            setDeletingOrder(false);
            showDeleteModal();
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
                        <td>{item.shelflevel}</td>
                        <td>{item.quantity}</td>
                        <td>{item.Item.Measure.name}</td>
                        {!orderIsClosed && <td>
                            <button className={style.btnEdit} onClick={editOrderItemClickHandler.bind(null, item)}><Icon size='20' icon='edit'/></button>
                            <button className={style.btnDelete} onClick={deleteOrderItemClickHandler.bind(null, item)}><Icon size='20' icon='xmark'/></button>
                        </td>}
                    </tr>
                );
            });
        } 

        let itemOptions = [<option key={0} value='0'>Choose an item...</option>];
        if (items.length > 0) {
            items.forEach((item) => {
                itemOptions.push(<option key={item.id} value={item.id}>{item.name}</option>);
            });
        }

        let shelfOptions = [<option  key={0} value='0'>Choose a shelf...</option>];
        if (shelves.length > 0) {
            shelves.forEach((shelf) => {
                shelfOptions.push(<option key={shelf.id} value={shelf.id}>{shelf.name}</option>);
            });
        }

        let shelfLevelOptions = [<option  key={0} value='0'>Choose a level...</option>];
        if (selectedShelf !== 0) {
            const shelfForLevel = shelves.find((shelf) => {                      
                if (shelf.id == selectedShelf) {
                    return true;
                }
                return false;
            });
            for (let i = 1; i <= shelfForLevel.levels; i++) {               
                shelfLevelOptions.push(<option  key={i} value={i}>{i}</option>);
            }
        }

        const quantityClass = qtyHasError ? style.invalid : ""; 

        const addModal = (
            <Modal onClose={hideAddModal}>
                <h3 className={style.mt0}>
                    {isEdit && `Edit order item (${selectedOrderItem.id})`}
                    {!isEdit && `Add item to order list`}
                </h3>
                <div className={`${style.inputGroup}`}>
                    <label>Items</label>
                    <select value={selectedItem} onChange={selectItemChangeHandler}>{itemOptions}</select>
                    <p>The field cannot be empty</p>
                </div>
                <div className={`${style.inputGroup}`}>
                    <label>Shelf</label>
                    <select value={selectedShelf} onChange={selectShelfChangeHandler}>{shelfOptions}</select>
                    <p>The field cannot be empty</p>
                </div>
                <div className={`${style.inputGroup}`}>
                    <label>Shelf level</label>
                    <select value={selectedShelfLevel} onChange={selectShelfLevelChangeHandler}>{shelfLevelOptions}</select>
                    <p>The field cannot be empty</p>
                </div>
                <div className={`${style.inputGroup} ${quantityClass}`}>
                    <label>Quantity ({selectedItemMeasure})</label>
                    <input type="text" onInput={qtyChangeHandler} onBlur={qtyBlurHandler} value={qtyEnteredValue}/>
                    <p>The field cannot be empty</p>
                </div>
                <div className={style.formBtns}>
                    {isEdit && <button className={`${style.btn} ${style.btnSuccess}`} onClick={editItemToDBClickHandler}>Save</button>}
                    {!isEdit && <button className={`${style.btn} ${style.btnSuccess}`} onClick={addItemToDBClickHandler}>Add item</button>}                 
                    <button className={`${style.btn} ${style.btnDefault}`} onClick={hideAddModal}>Cancel</button>
                </div>
            </Modal>
        );

        const deleteModal = (
            <Modal onClose={hideDeleteModal}>               
                <Fragment>
                    <h3 className={style.mt0}>
                        {!deletingOrder && `Delete order item (${selectedOrderItem.id})`}
                        {deletingOrder && `Delete order`}
                    </h3>
                    <p>Are you sure you want to delete this order {!deletingOrder && `item`}?</p>
                    <div className={style.formBtns}>
                        {deletingOrder && <button className={`${style.btn} ${style.btnDanger}`} onClick={deleteOrderFromDBHandler}>Delete</button>}
                        {!deletingOrder && <button className={`${style.btn} ${style.btnDanger}`} onClick={deleteOrderItemFromDBClickHandler}>Delete</button>}                       
                        <button className={`${style.btn} ${style.btnDefault}`} onClick={hideDeleteModal}>Cancel</button>
                    </div>
                </Fragment>               
            </Modal>
        );

        const confirmModal = (
            <Modal onClose={hideCloseModal}>               
                <Fragment>
                    <h3 className={style.mt0}>
                        Close order
                    </h3>
                    <p>Are you sure you want to close this order? This will make item movements!</p>
                    <div className={style.formBtns}>
                        <button className={`${style.btn} ${style.btn}`} onClick={closeOrderHandler}>Close</button>                                          
                        <button className={`${style.btn} ${style.btnDefault}`} onClick={hideCloseModal}>Cancel</button>
                    </div>
                </Fragment>               
            </Modal>
        );

        let closeErrors = [];
        closeErrors = closeErrorArray.map((error, index) => {
            return <li key={index}>{error}</li>
        });

        const closeErrorModal = (
            <Modal onClose={hideErrorModal}>               
                <Fragment>
                    <h3 className={style.mt0}>
                        Can not close order
                    </h3>
                    <ul className={style.closeErrorUl}>
                        {closeErrors}
                    </ul>
                    <div className={style.formBtns}>                                                            
                        <button className={`${style.btn} ${style.btnDefault}`} onClick={hideErrorModal}>Ok</button>
                    </div>
                </Fragment>               
            </Modal>
        );
    
        return (
            <div className={style.container}>
                {isShownAddModal && addModal}
                {isShownDeleteModal && deleteModal}
                {isShownCloseModal && confirmModal}
                {isShownErrorModal && closeErrorModal}
                <div className={style.box}>
                    {!orderIsClosed && <div className={style.floatR}>
                        <button className={`${style.btn} ${style.btnSuccess}`} onClick={addItemOnClickHandler}>Add item</button>
                        <button className={`${style.btn}`} disabled={orderItems.length === 0} onClick={closeOrderClickHandler}>Close</button>                                          
                        <button className={`${style.btn} ${style.btnDanger}`} onClick={initDeleteOrderHandler}>Delete order</button>
                    </div>}
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
                                <th>Shelf level</th>
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