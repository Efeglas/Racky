import style from './Users.module.css';

import { Fragment, useState, useEffect } from "react";
import Icon from '../icons/Icon';
import useModal from '../hooks/use-Modal';
import Modal from '../components/modal/Modal';
import useInput from '../hooks/use-Input';
import useCustomFetch from '../hooks/use-CustomFetch';
import useValidate from '../hooks/use-Validate';

const Items = () =>{
    const [resultItems, setResultItems] = useState();
    const [resultMeasures, setResultMeasures] = useState();
    
    const [selectedItem, setSelectedItem] = useState({});

    const [itemFilter, setItemFilter] = useState("");
    const [itemFilterInput, setItemFilterInput] = useState("");

    const [isLocked, setIsLocked] = useState(true);
    const [isEdit, setIsEdit] = useState(true);

    const customFetch = useCustomFetch();
    const {
        notEmpty: validateNotEmpty,
        positiveNumber: validatePositiveNumber
    } = useValidate();

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
    } = useInput(validateNotEmpty);

    const {
        value: barcodeEnteredValue,
        setValue: setbarcodeEnteredValue,
        isValid: barcodeIsValid,
        hasError: barcodeHasError,
        changeHandler: barcodeChangeHandler,
        blurHandler:barcodeBlurHandler,
        reset: barcodeReset,
    } = useInput(validatePositiveNumber);

    const {
        value: priceEnteredValue,
        setValue: setpriceEnteredValue,
        isValid: priceIsValid,
        hasError: priceHasError,
        changeHandler: priceChangeHandler,
        blurHandler:priceBlurHandler,
        reset: priceReset,
    } = useInput(validatePositiveNumber);

    const {
        value: measureEnteredValue,
        setValue: setmeasureEnteredValue,
        isValid: measureIsValid,
        hasError: measureHasError,
        changeHandler: measureChangeHandler,
        blurHandler:measureBlurHandler,
        reset: measureReset,
    } = useInput(value => value !== "0");

    const loadItems = async () => {
        const response = await fetch("http://192.168.50.62:8080/item/get", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token: localStorage.getItem("token")}) 
        });
        const json = await response.json();
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
            setResultMeasures(json.data);
    }

    useEffect(() => {
        
        loadItems();
        loadMeasures();
        setmeasureEnteredValue("0");
    }, []);

    const userEditOnClickHandler = (item) => {
        setSelectedItem(item);
        setIsLocked(true);
        setIsEdit(true);
        setmeasureEnteredValue(item.Measure.id);
        setbarcodeEnteredValue(item.barcode);
        setpriceEnteredValue(item.Prices[0].price);
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
        
        const data = {
            token: localStorage.getItem("token"),
            id: selectedItem.id,             
        };

        const afterSuccess = () => {loadItems();}
        const generalEnd = () => {hideDeleteModal();}

        customFetch("/item", data, "DELETE", afterSuccess, generalEnd); 
    }

    const saveEditOnClickHandler = async () => {

        if (!itemNameIsValid && !barcodeIsValid && !measureIsValid && !priceIsValid) {
            itemNameBlurHandler();
            barcodeBlurHandler();
            measureBlurHandler();
            priceBlurHandler();
            return;
        }

        const data = {
            token: localStorage.getItem("token"),
            id: selectedItem.id,
            name: itemNameEnteredValue,
            barcode: barcodeEnteredValue,
            measure: measureEnteredValue,
            price: priceEnteredValue
        };

        const afterSuccess = () => {loadItems();}
        const generalEnd = () => {hideEditModal();}

        customFetch("/item", data, "PATCH", afterSuccess, generalEnd);
    }

    const addOnClickHandler = async () => {

        if (!itemNameIsValid && !barcodeIsValid && !measureIsValid && !priceIsValid) {
            itemNameBlurHandler();
            barcodeBlurHandler();
            measureBlurHandler();
            priceBlurHandler();
            return;
        }
        
        const data = {
            token: localStorage.getItem("token"),              
            name: itemNameEnteredValue,
            measure: measureEnteredValue,
            barcode: barcodeEnteredValue,
            price: priceEnteredValue
        };

        const afterSuccess = () => {loadItems();}
        const generalEnd = () => {hideEditModal();}

        customFetch("/item/add", data, "POST", afterSuccess, generalEnd);
    }

    const addItemOnClickHandler = () => {
        setIsEdit(false);
        setIsLocked(false);      
        measureReset("0")
        itemNameReset();
        barcodeReset();
        priceReset();
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
                    <td>{`${item.Prices[0].price} Ft`}</td>
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
        item.Prices[0].price.toString().toLowerCase().includes(filterLowerCase) ||
            item.Measure.name.toLowerCase().includes(filterLowerCase)) {
                return true;
            } 
            return false;
    }

    const selectOnChangeHandler = (event) => {
        setmeasureEnteredValue(event.target.value);
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

    const itemNameClass = itemNameHasError && !isLocked ? style.invalid : "";
    const barcodeClass = barcodeHasError && !isLocked ? style.invalid : "";
    const priceClass = priceHasError && !isLocked ? style.invalid : "";
    const measureClass = measureHasError && !isLocked ? style.invalid : "";
     
    const editModal = (
        <Modal onClose={hideEditModal}>
            <div className={`${style.flex} ${style.flexSpaceBetw}`}>
                {isEdit && <h3 className={style.mt0}>Edit item</h3>}
                {!isEdit && <h3 className={style.mt0}>Add item</h3>}         
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
            <div className={`${style.inputGroup} ${priceClass}`}>
                <label>Price</label>
                <input type="text" value={priceEnteredValue} onInput={priceChangeHandler} onBlur={priceBlurHandler}/>
                <p>This fild must be a positive number</p>
            </div>       
            <div className={`${style.inputGroup} ${measureClass}`}>
                <label>Measure</label>
                <select value={measureEnteredValue} onChange={selectOnChangeHandler}>
                    <option value={0}>Choose a measure...</option>
                    {selectOptions}
                </select>
                <p>Please choose a measure</p>
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
                                <th>Price</th>
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