import style from './InventoryTable.module.css';
import { useState, useEffect, useRef } from 'react';
import useInput from '../hooks/use-Input';
import Icon from '../icons/Icon';
import { useNavigate } from 'react-router-dom';

const OrderTable = (props) => {

    const navigate = useNavigate();
    const resultOrders = props.orders;
    
    const idRef = useRef();
    const userRef = useRef();
    const directionRef = useRef();
    const createdRef = useRef();
    const closedRef = useRef();
    const statusRef = useRef();

    const [pageState, setPage] = useState(1);  

    const [filter, setFilter] = useState({
        id: "",
        user: "",
        direction: "",
        created: "",
        closed: "",
        status: ""
    });   

    const generateTr = (order) => {

       let status = <div className={style.ticketCreated}>Created</div>;
       if (order.closed !== null) {
        status = <div className={style.ticketClosed}>Closed</div>;
       }

       let replacedCreatedDate = order.createdAt.replace('T', ' ');
       replacedCreatedDate = replacedCreatedDate.replace('.000Z', '');
       
       let replacedClosedDate = "-";
       if (order.closed !== null) {
           replacedClosedDate = order.closed.replace('T', ' ');
           replacedClosedDate = replacedClosedDate.replace('.000Z', '');
       }

       let direction = <div className={style.cin} title='ORDER IN'><Icon size='20' icon='orderin'/></div>;
       if (order.Direction.id === 2) {
        direction = <div className={style.cout} title='ORDER OUT'><Icon size='20' icon='orderout'/></div>;
       } 
      
        return (<tr className={style.order} key={order.id} onClick={()=>{ navigate('/order/' + order.id) }}>
            <td>{order.id}</td>
            <td>{direction}</td>
            <td>{order.User.firstName}</td>
            <td>{replacedCreatedDate}</td>
            <td>{replacedClosedDate}</td>
            <td>{status}</td>
        </tr>);
    }

    const filteredOrders = resultOrders.filter((order) => {

        let status = "Created";
        if (order.closed !== null) {
            status = "Closed";
        }

        let replacedCreatedDate = order.createdAt.replace('T', ' ');
       replacedCreatedDate = replacedCreatedDate.replace('.000Z', '');
       
       let replacedClosedDate = "-";
       if (order.closed !== null) {
           replacedClosedDate = order.closed.replace('T', ' ');
           replacedClosedDate = replacedClosedDate.replace('.000Z', '');
       }

        if (order.id.toString().includes(filter.id) &&          
                order.User.firstName.toLowerCase().includes(filter.user.toLowerCase()) &&
                replacedCreatedDate.toLowerCase().includes(filter.created.toLowerCase()) &&
                order.Direction.name.toLowerCase().includes(filter.direction.toLowerCase()) &&
                replacedClosedDate.toLowerCase().includes(filter.closed.toLowerCase()) &&
                status.toLowerCase().includes(filter.status.toLowerCase())) {
                    return true;
        }
        return false;
    });

    const ordersLength = filteredOrders.length;
    const divider = Math.ceil(ordersLength / 10);
    const pageFrom = ((pageState - 1) * 10) + 1;
    const pageTo = pageState * 10;

    const pageUpHandler = () => {
        if (pageState < divider) {           
            setPage(pageState + 1);
        }
    }

    const pageDownHandler = () => {
        if (pageState > 1) {           
            setPage(pageState - 1);
        }
    }
    
    let pageDataJSX = [];
    if (filteredOrders.length > 0) {      
        pageDataJSX = filteredOrders.slice(pageFrom - 1, pageTo).map((order) => {
            return generateTr(order);
        })
    } else {
        pageDataJSX = <tr><td colSpan={6} className={style.textCenter}>No data available...</td></tr>;
    }

    const pageOptions = [];
    for (let i = 1; i <= divider; i++) {
        pageOptions.push(<option value={i} key={i}>{i}. oldal</option>);   
    }

    const searchOnKeyDownHandler = (event) => {

        if (event.keyCode === 13) {         
            setFilter({
                id: idRef.current.value,
                user: userRef.current.value,
                direction: directionRef.current.value,
                created: createdRef.current.value,
                closed: closedRef.current.value,
                status: statusRef.current.value
            });
        }
    }

    const searchOnClickHandler = () => {
        setFilter({
            id: idRef.current.value,
            user: userRef.current.value,
            direction: directionRef.current.value,
            created: createdRef.current.value,
            closed: closedRef.current.value,
            status: statusRef.current.value
        });
    } 

    const pageSelectChangeHandler = (event) => {
        setPage(event.target.value);
    }

    return (
        <div className={style.inventory}>
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Direction</th>
                            <th>User</th>
                            <th>Created at</th>
                            <th>Closed at</th>
                            <th>Status</th>                         
                        </tr>
                        <tr className={style.filterRow}>
                            <td><input type='text' placeholder='ID' ref={idRef} onKeyDown={searchOnKeyDownHandler}/></td>
                            <td><select ref={directionRef}><option value=''>All</option><option value='in'>In</option><option value='out'>Out</option></select></td>
                            <td><input type='text' placeholder='User' ref={userRef} onKeyDown={searchOnKeyDownHandler}/></td>
                            <td><input type='text' placeholder='Created at' ref={createdRef} onKeyDown={searchOnKeyDownHandler}/></td>
                            <td><input type='text' placeholder='Closed at' ref={closedRef} onKeyDown={searchOnKeyDownHandler}/></td>                          
                            <td className={style.last}><input type='text' placeholder='Status' ref={statusRef} onKeyDown={searchOnKeyDownHandler}/><button onClick={searchOnClickHandler}><Icon size='12' icon='search'/></button></td>
                        </tr>
                    </thead>
                    <tbody>
                        {pageDataJSX}
                    </tbody>
                </table>
                <hr className={style.mb0}></hr>
                <div className={style.pagination}>
                    <div>
                        <p>Showing {pageFrom} to {pageTo} of {ordersLength} entries</p>
                    </div>
                    <div>
                        <button onClick={pageDownHandler}><Icon size='20' icon='angle-left' /></button>
                        <select value={pageState} onChange={pageSelectChangeHandler}>
                            {pageOptions}
                        </select>
                        <button onClick={pageUpHandler}><Icon size='20' icon='angle-right' /></button>
                    </div>
                </div>
            </div>

    );
}

export default OrderTable;