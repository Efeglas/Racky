import Icon from '../icons/Icon';
import style from './Inventory.module.css';
import { useState, useEffect } from 'react';

const Inventory = () => {

    const [resultInventory, setResultInventory] = useState({});

    const loadInventory = async () => {

        const response = await fetch("http://192.168.50.62:8080/inventory/get", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token: localStorage.getItem("token")}) 
        });
        const json = await response.json();
        console.log(json);
        setResultInventory(json.inventory);  
    }

    useEffect(() => {
        loadInventory();
    }, []);

    const generateOptions = () => {
        //? PLACEHOLDER
        const array = [];
        for (let i = 1; i <= 100; i++) {
            array.push(<option key={i} value={i}>{i}</option>);
        }
        return array;
    }

    return (
        <div className={style.container}>
                          
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
                        <tr>
                            <td><input type='text' placeholder='ID'/></td>
                            <td><input type='text' placeholder='Item'/></td>
                            <td><input type='text' placeholder='Quantity'/></td>
                            <td><input type='text' placeholder='Measure'/></td>
                            <td><input type='text' placeholder='Shelf'/></td>
                            <td><input type='text' placeholder='Shelf level'/></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Chocolate</td>
                            <td>100</td>
                            <td>pcs</td>
                            <td>S4</td>
                            <td>4</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Chocolate</td>
                            <td>100</td>
                            <td>pcs</td>
                            <td>S4</td>
                            <td>4</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Chocolate</td>
                            <td>100</td>
                            <td>pcs</td>
                            <td>S4</td>
                            <td>4</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Chocolate</td>
                            <td>100</td>
                            <td>pcs</td>
                            <td>S4</td>
                            <td>4</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Chocolate</td>
                            <td>100</td>
                            <td>pcs</td>
                            <td>S4</td>
                            <td>4</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Chocolate</td>
                            <td>100</td>
                            <td>pcs</td>
                            <td>S4</td>
                            <td>4</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Chocolate</td>
                            <td>100</td>
                            <td>pcs</td>
                            <td>S4</td>
                            <td>4</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Chocolate</td>
                            <td>100</td>
                            <td>pcs</td>
                            <td>S4</td>
                            <td>4</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Chocolate</td>
                            <td>100</td>
                            <td>pcs</td>
                            <td>S4</td>
                            <td>4</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Chocolate</td>
                            <td>100</td>
                            <td>pcs</td>
                            <td>S4</td>
                            <td>4</td>
                        </tr>
                    </tbody>
                </table>
                <hr className={style.mb0}></hr>
                <div className={style.pagination}>
                    <div>
                        <p>Showing 1 to 10 of 57 entries</p>
                    </div>
                    <div>
                        <button><Icon size='20' icon='angle-left' /></button>
                        <select>
                            {generateOptions()}
                        </select>
                        . oldal
                        <button><Icon size='20' icon='angle-right' /></button>
                    </div>
                </div>
            </div>
            
            <div className={style.layout}>
                <div>
                    <h4>Layout:</h4>
                    <p>No available layout...</p>
                </div>
                <div>
                    <h4>Shelf:</h4>
                    <p>No available shelf...</p>
                </div>
            </div>

        </div>
    );
} 

export default Inventory;