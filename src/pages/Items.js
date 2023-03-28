import style from './Users.module.css';

import { Fragment, useState, useEffect } from "react";
import Icon from '../icons/Icon';
import useModal from '../hooks/use-Modal';
import Modal from '../components/modal/Modal';
import useInput from '../hooks/use-Input';
import { toast } from 'react-toastify';

const Items = () =>{
    const [resultItems, setResultItems] = useState();
    const [resultMeasures, setResultMeasures] = useState();
    
    const [selectedItem, setSelectedItem] = useState({});
    const [selectedMeasureValue, setSelectedMeasureValue] = useState(0);

    const [itemFilter, setItemFilter] = useState("");
    const [itemFilterInput, setItemFilterInput] = useState("");

    const [isLocked, setIsLocked] = useState(true);
    const [isEdit, setIsEdit] = useState(true);

    const {
        isShown: isShownEditModal,
        hide: hideEditModal,
        show: showEditModal
    } = useModal();

    const {
        isShown: isShownDeleteModal,
        hide: hideDeleteModal,
        show: showDeleteModal
    } = useModal();

    const {
        value: itemNameEnteredValue,
        setValue: setitemNameEnteredValue,
        isValid: itemNameIsValid,
        hasError: itemNameHasError,
        changeHandler: itemNameChangeHandler,
        blurHandler:itemNameBlurHandler,
        reset: itemNameReset,
    } = useInput(value => value.trim() !== "");

    const {
        value: barcodeEnteredValue,
        setValue: setbarcodeEnteredValue,
        isValid: barcodeIsValid,
        hasError: barcodeHasError,
        changeHandler: barcodeChangeHandler,
        blurHandler:barcodeBlurHandler,
        reset: barcodeReset,
    } = useInput(value => value.trim() !== "");

    const loadItems = async () => {
        const response = await fetch("http://192.168.50.62:8080/item/get", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token: localStorage.getItem("token")}) 
        });
        const json = await response.json();
        console.log(json);
        setResultItems(json.data);     
    }

    const loadMeasures = async () => {

        const response = await fetch("http://192.168.50.62:8080/item/measure", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({token: localStorage.getItem("token")}) 
            });
            const json = await response.json();
            console.log(json);
            setResultMeasures(json.data);
    }

    useEffect(() => {
        
        loadItems();
        loadMeasures();
    }, []);

    const userEditOnClickHandler = (item) => {
        setSelectedItem(item);
        setIsLocked(true);
        setIsEdit(true);
        console.log(selectedItem);
        setSelectedMeasureValue(item.Measure.id);
        setbarcodeEnteredValue(item.barcode);
        
        setitemNameEnteredValue(item.name);

        showEditModal();
    }

    const searchOnClickHandler = () => {
        setItemFilter(itemFilterInput);
    }

    const searchOnKeyDownHandler = (event) => {
        if (event.key === "Enter") {
            setItemFilter(itemFilterInput);
        }

        if (event.keyCode === 8) {
            setItemFilter("");
        }
    }

    const deleteOnClickHandler = async () => {
        
        const response = await fetch("http://192.168.50.62:8080/item/delete", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"),
                id: selectedItem.id,             
            }) 
        });
        const json = await response.json();
        console.log(json);

        if (response.ok) {
            toast.success('User deleted', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            loadItems();
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

        hideDeleteModal();
    }

    const saveEditOnClickHandler = async () => {
        const response = await fetch("http://192.168.50.62:8080/item/edit", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"),
                id: selectedItem.id,
                name: itemNameEnteredValue,
                barcode: barcodeEnteredValue,
                measure: selectedMeasureValue
            }) 
        });
        const json = await response.json();
        console.log(json);

        if (response.ok) {
            toast.success('Item edited', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            loadItems();
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

        hideEditModal(); 
    }

    const addOnClickHandler = async () => {
        
        const response = await fetch("http://192.168.50.62:8080/item/add", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"),              
                name: itemNameEnteredValue,
                measure: selectedMeasureValue,
                barcode: barcodeEnteredValue,
            }) 
        });
        const json = await response.json();
        console.log(json);

        if (response.ok) {
            toast.success('Item added', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            loadItems();
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

        hideEditModal();  
    }

    const addItemOnClickHandler = () => {
        setIsEdit(false);
        setIsLocked(false);      
        setSelectedMeasureValue(0);
        itemNameReset();
        barcodeReset();
        showEditModal();
    }

    const userDeleteOnClickHandler = (user) => {
        setSelectedItem(user);
        showDeleteModal();
    }

    const searchOnChangeHandler = (event) => {
        setItemFilterInput(event.target.value);
    }

    const generateTRs = (data) => {

        return data.map((item) => {       
            return (
                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.barcode}</td>
                    <td>{item.name}</td>
                    <td>{item.Measure.name}</td>
                    <td>                     
                        <button className={style.btnEdit} title='Edit' onClick={userEditOnClickHandler.bind(null, item)}><Icon size='20' icon='edit'/></button>
                        <button className={style.btnDelete} title='Delete' onClick={userDeleteOnClickHandler.bind(null, item)}><Icon size='20' icon='trash'/></button>
                    </td>
                </tr>);
        });
    }

    const generateSelectOptions = (data) => {    
        return data.map((role) => {
            return <option key={role.id} value={role.id}>{role.name}</option>
        });
    }

    let selectOptions = <option>No data awailable...</option>;

    if (resultMeasures !== undefined) {
        selectOptions = generateSelectOptions(resultMeasures);
    }

    const filterIsInItemObj = (item) => {

        const filterLowerCase = itemFilter.toLowerCase();

        if (item.name.toLowerCase().includes(filterLowerCase) || 
        item.barcode.toLowerCase().includes(filterLowerCase) ||         
            item.Measure.name.toLowerCase().includes(filterLowerCase)) {
                return true;
            } 
            return false;
    }

    let tbody = <tr><td colSpan='5' className={style.textCenter}>No data available...</td></tr>;

    if (resultItems !== undefined) {
        const filteredUsers = resultItems.filter(filterIsInItemObj);

        if (filteredUsers.length > 0) {
            tbody = generateTRs(filteredUsers);
        } else {
            tbody = <tr><td colSpan='5' className={style.textCenter}>No data available...</td></tr>;
        }
    }

    const selectOnChangeHandler = (event) => {
        setSelectedMeasureValue(event.target.value);
    }

     const itemNameClass = itemNameHasError && !isLocked ? style.invalid : "";
     const barcodeClass = barcodeHasError && !isLocked ? style.invalid : "";
     

    const editModal = (
        <Modal onClose={hideEditModal}>
            <div className={`${style.flex} ${style.flexSpaceBetw}`}>
                <h3 className={style.mt0}>Edit item</h3>              
            </div>
            <div className={`${style.inputGroup} ${itemNameClass}`}>
                <label>Item name</label>
                <input type="text" value={itemNameEnteredValue} onInput={itemNameChangeHandler} onBlur={itemNameBlurHandler}/>
                <p>The field cannot be empty</p>
            </div>  
            <div className={`${style.inputGroup} ${barcodeClass}`}>
                <label>Barcode</label>
                <input type="text" value={barcodeEnteredValue} onInput={barcodeChangeHandler} onBlur={barcodeBlurHandler}/>
                <p>The field cannot be empty</p>
            </div>         
            <div className={style.inputGroup}>
                <label>Measure</label>
                <select value={selectedMeasureValue} onChange={selectOnChangeHandler}>
                    <option value={0}>Choose a measure...</option>
                    {selectOptions}
                </select>
            </div>
            <div className={style.formBtns}>                         
                {isEdit && <button className={`${style.btn} ${style.btnSuccess}`} onClick={saveEditOnClickHandler}>Save</button>}  
                {!isEdit && <button className={`${style.btn} ${style.btnSuccess}`} onClick={addOnClickHandler}>Add</button>}     
                <button className={`${style.btn} ${style.btnDefault}`} onClick={hideEditModal}>Cancel</button>        
            </div>
        </Modal>
    );

    const deleteModal = (
        <Modal onClose={hideDeleteModal}>
          <h3 className={style.mt0}>Delete {selectedItem.name} item</h3>
            <p>Are you sure you want to delete this item?</p>
            <div className={style.formBtns}>
                <button className={`${style.btn} ${style.btnDanger}`} onClick={deleteOnClickHandler}>Delete</button>
                <button className={`${style.btn} ${style.btnDefault}`} onClick={hideDeleteModal}>Cancel</button>
            </div>
        </Modal>
    );

    return (
        <Fragment>
            {isShownEditModal && editModal}
            {isShownDeleteModal && deleteModal}         
            <div className={style.container}>
                <div className={`${style.flex} ${style.flexEnd} ${style.mb1}`}>                  
                        <div className={style.inputGroup}>
                            <input type='text' placeholder='Search...' value={itemFilterInput} onChange={searchOnChangeHandler} onKeyDown={searchOnKeyDownHandler}/>
                        </div>                
                    <button className={`${style.btn} ${style.btnDefault}`} onClick={searchOnClickHandler}>Search</button>
                    <button className={`${style.btn} ${style.btnSuccess}`} onClick={addItemOnClickHandler}>Add item</button>
                </div>
                <div className={style.roles}>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Barcode</th>
                                <th>Item name</th>
                                <th>Measure</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tbody}                                        
                        </tbody>
                    </table>
                </div>
            </div>  
        </Fragment>
    );
}

export default Items;