import Icon from '../icons/Icon';
import style from './Inventory.module.css';
import { useState, useEffect } from 'react';
import useInput from '../hooks/use-Input';
import InventoryTable from '../components/InventoryTable';
import MiniLayout from '../components/MiniLayout';
import MiniShelf from '../components/MiniShelf';

const Inventory = () => {

    const [resultInventory, setResultInventory] = useState([]);
    const [resultLayout, setResultLayout] = useState({});
    const [selectedInventory, setSelectedInventory] = useState({});
    
    const loadInventory = async () => {

        const response = await fetch("http://192.168.50.62:8080/inventory/get", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token: localStorage.getItem("token")}) 
        });
        const json = await response.json();
        setResultInventory(json.data);  
    }

    const loadLayout = async () => {
        if (selectedInventory.id !== undefined) {

            const response = await fetch("http://192.168.50.62:8080/inventory/layout", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({token: localStorage.getItem("token"), layout: selectedInventory.Shelf.LayoutId}) 
            });
            const json = await response.json();
            setResultLayout(json.data); 
        }
    }

    const onInventoryClick = (inventory) => {
        setSelectedInventory(inventory);
    }

    useEffect(() => {
        loadInventory();
    }, []);

    useEffect(() => {
        loadLayout();
    }, [selectedInventory]);


    return (
        <div className={style.container}>
                          
            <InventoryTable inventory={resultInventory} onInventoryClick={onInventoryClick} invid={selectedInventory.id}/>
            
            <div className={style.layout}>
                <div>
                    <h4>Layout: {resultLayout.Shelves !== undefined && `(${resultLayout.name})`}</h4>
                    
                    { resultLayout.Shelves === undefined && <p>No available layout...</p>}
                    { resultLayout.Shelves !== undefined && <MiniLayout layout={resultLayout} shelf={selectedInventory.Shelf} />}
                    
                </div>
                <div>
                    <h4>Shelf: {resultLayout.Shelves !== undefined && `(${selectedInventory.Shelf.name})`}</h4>
                    { resultLayout.Shelves === undefined && <p>No available shelf...</p>}
                    { resultLayout.Shelves !== undefined && <MiniShelf inventory={selectedInventory}/>}
                </div>
            </div>

        </div>
    );
} 

export default Inventory;