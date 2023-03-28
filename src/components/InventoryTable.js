import style from './InventoryTable.module.css';
import { useState, useEffect, useRef } from 'react';
import useInput from '../hooks/use-Input';
import Icon from '../icons/Icon';

const InventoryTable = (props) => {

    const resultInventory = props.inventory;
    const invID = props.invid;
    

    const idRef = useRef();
    const itemRef = useRef();
    const quantityRef = useRef();
    const measureRef = useRef();
    const shelfRef = useRef();
    const levelRef = useRef();

    const [pageState, setPage] = useState(1);  

    const [filter, setFilter] = useState({
        id: "",
        item: "",
        quantity: "",
        measure: "",
        shelf: "",
        level: "",
    });   

    const generateTr = (inventory, invID) => {

        let selectedStyle = "";
        if (invID === inventory.id) {
            selectedStyle = style.selected;
        }
        return (<tr key={inventory.id} onClick={ props.onInventoryClick.bind(null, inventory)} className={selectedStyle}>
            <td>{inventory.id}</td>
            <td>{inventory.Item.name}</td>
            <td>{inventory.quantity}</td>
            <td>{inventory.Item.Measure.name}</td>
            <td>{inventory.Shelf.name}</td>
            <td>{inventory.shelflevel}</td>
        </tr>);
    }

    const filteredInventory = resultInventory.filter((inventory) => {

        if (inventory.id.toString().includes(filter.id) &&
                inventory.shelflevel.toString().includes(filter.level) &&
                inventory.quantity.toString().includes(filter.quantity) &&
                inventory.Item.name.toLowerCase().includes(filter.item.toLowerCase()) &&
                inventory.Item.Measure.name.toLowerCase().includes(filter.measure.toLowerCase()) &&
                inventory.Shelf.name.toLowerCase().includes(filter.shelf.toLowerCase())) {
                    return true;
        }
        return false;
    });

    console.log(filteredInventory);

    const inventoryLength = filteredInventory.length;
    const divider = Math.ceil(inventoryLength / 10);
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
    
    const pageDataJSX = filteredInventory.slice(pageFrom - 1, pageTo).map((inventory) => {
        return generateTr(inventory, invID);
    })

    const pageOptions = [];
    for (let i = 1; i <= divider; i++) {
        pageOptions.push(<option value={i} key={i}>{i}. oldal</option>);   
    }

    const searchOnKeyDownHandler = (event) => {

        if (event.keyCode === 13) {         
            setFilter({
                id: idRef.current.value,
                item: itemRef.current.value,
                quantity: quantityRef.current.value,
                measure: measureRef.current.value,
                shelf: shelfRef.current.value,
                level: levelRef.current.value,
            });
        }
    }

    const searchOnClickHandler = () => {
        setFilter({
            id: idRef.current.value,
            item: itemRef.current.value,
            quantity: quantityRef.current.value,
            measure: measureRef.current.value,
            shelf: shelfRef.current.value,
            level: levelRef.current.value,
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
                            <th>ID</th>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Measure</th>
                            <th>Shelf</th>
                            <th>Shelf level</th>
                        </tr>
                        <tr className={style.filterRow}>
                            <td><input type='text' placeholder='ID' ref={idRef} onKeyDown={searchOnKeyDownHandler}/></td>
                            <td><input type='text' placeholder='Item' ref={itemRef} onKeyDown={searchOnKeyDownHandler}/></td>
                            <td><input type='text' placeholder='Quantity' ref={quantityRef} onKeyDown={searchOnKeyDownHandler}/></td>
                            <td><input type='text' placeholder='Measure' ref={measureRef} onKeyDown={searchOnKeyDownHandler}/></td>
                            <td><input type='text' placeholder='Shelf' ref={shelfRef} onKeyDown={searchOnKeyDownHandler}/></td>
                            <td className={style.last}><input type='text' placeholder='Shelf level' ref={levelRef} onKeyDown={searchOnKeyDownHandler}/><button onClick={searchOnClickHandler}><Icon size='12' icon='search'/></button></td>
                        </tr>
                    </thead>
                    <tbody>
                        {pageDataJSX}
                    </tbody>
                </table>
                <hr className={style.mb0}></hr>
                <div className={style.pagination}>
                    <div>
                        <p>Showing {pageFrom} to {pageTo} of {inventoryLength} entries</p>
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

export default InventoryTable;