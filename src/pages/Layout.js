import { Fragment, useEffect, useState } from "react";
import style from "./Layout.module.css";
import Icon from "../icons/Icon";
import Modal from "../components/modal/Modal";
import useModal from "../hooks/use-Modal";
import useInput from "../hooks/use-Input";
import useCustomFetch from '../hooks/use-CustomFetch';
import useToast from "../hooks/use-Toast";
import useValidate from "../hooks/use-Validate";

const Layout = () => {

    const [resultLayouts, setResultLayouts] =  useState([]); 
    const [resultShelves, setResultShelves] =  useState([]); 

    const [selectedLayout, setSelectedLayout] =  useState(0);

    const [layoutWidth, setLayoutWidth] =  useState(0);
    const [layoutHeight, setLayoutHeight] =  useState(0);

    const [grid, setGrid] = useState([]);
    const [layoutGridJSX, setLayoutGridJSX] = useState([]);

    const [shelfColors, setShelfColors] = useState({});

    const [isShelfPlacing, setIsShelfPlacing] = useState(false);
    const [shelfCoords, setShelfCoords] = useState([]);

    const [selectedShelf, setSelectedShelf] = useState();

    const [deleteMode, setDeleteMode] = useState('shelf');
    const [isEditShelf, setIsEditShelf] = useState(false);

    const customFetch = useCustomFetch();
    const fireToast = useToast();

    const {
        notEmpty: validateNotEmpty,
        positiveNumber: validatePositiveNumber
    } = useValidate();
    
    const {
        isShown: isShownAddLayoutModal,
        hide: hideAddLayoutModal,
        show: showAddLayoutModal
    } = useModal();

    const {
        isShown: isShownAddShelfModal,
        hide: hideAddShelfModal,
        show: showAddShelfModal
    } = useModal();

    const {
        isShown: isShownDeleteModal,
        hide: hideDeleteModal,
        show: showDeleteModal
    } = useModal();

    const {
        value: layoutEnteredValue,
        setValue: setlayoutEnteredValue,
        isValid: layoutIsValid,
        hasError: layoutHasError,
        changeHandler: layoutChangeHandler,
        blurHandler:layoutBlurHandler,
        reset: layoutReset,
    } = useInput(validateNotEmpty);

    const {
        value: widthEnteredValue,
        setValue: setwidthEnteredValue,
        isValid: widthIsValid,
        hasError: widthHasError,
        changeHandler: widthChangeHandler,
        blurHandler:widthBlurHandler,
        reset: widthReset,
    } = useInput(validatePositiveNumber);

    const {
        value: heightEnteredValue,
        setValue: setheightEnteredValue,
        isValid: heightIsValid,
        hasError: heightHasError,
        changeHandler: heightChangeHandler,
        blurHandler:heightBlurHandler,
        reset: heightReset,
    } = useInput(validatePositiveNumber);

    const {
        value: shelfNameEnteredValue,
        setValue: setshelfNameEnteredValue,
        isValid: shelfNameIsValid,
        hasError: shelfNameHasError,
        changeHandler: shelfNameChangeHandler,
        blurHandler:shelfNameBlurHandler,
        reset: shelfNameReset,
    } = useInput(validateNotEmpty);

    const {
        value: shelfLevelEnteredValue,
        setValue: setshelfLevelEnteredValue,
        isValid: shelfLevelIsValid,
        hasError: shelfLevelHasError,
        changeHandler: shelfLevelChangeHandler,
        blurHandler:shelfLevelBlurHandler,
        reset: shelfLevelReset,
    } = useInput(validatePositiveNumber);

    const generateLayoutOptions = () => {
        if (resultLayouts.length > 0) {
            return resultLayouts.map((layout) => {
                return <option key={layout.id} value={layout.id}>{layout.name}</option>
            });
        } 
    }

    const onLayoutSelectChangeHandler = (event) => {

        setSelectedLayout(event.target.value);
        const layout = resultLayouts.find((layout) => {return layout.id == event.target.value});
        if (layout != undefined) {
            setLayoutHeight(layout.height);
            setLayoutWidth(layout.width);
        }
    }

    const loadShelfs = async () => {

        const response = await fetch("http://192.168.50.62:8080/layout/shelves", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"), 
                layout: selectedLayout                           
            }) 
        });
        const json = await response.json();
        console.log(json);
        setResultShelves(json.data);
    }

    const getRndInteger = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    const generateLayoutGrid = () => {
        console.log("generateLayoutGrid");
        const temp = [];
        for (let i = 0; i < layoutHeight; i++) {
            const widthElementArray = [];
            for (let j = 0; j < layoutWidth; j++) {
            
                widthElementArray.push({shelf: null});
            }
            temp.push(widthElementArray);
        }
        
        resultShelves.forEach((shelf) => {
            //? x1 y1
            //? x2 y2
            setShelfColors((prevState) => {
                let obj = {};
                obj[shelf.id] = {r:getRndInteger(0,255), g:getRndInteger(0,255), b:getRndInteger(0,255)};
                return {...prevState, ...obj }
            });

            if (shelf.x1 === shelf.x2) {
                for (let y = shelf.y1; y <= shelf.y2; y++) {                 
                    temp[shelf.x1][y] = {shelf: shelf.id};
                }
            } else {
                for (let x = shelf.x1; x <= shelf.x2; x++) {                 
                    temp[x][shelf.y1] = {shelf: shelf.id};
                }
            }
        });
        
        setGrid(temp);      
    }

    const placeShelfClickHandler = () => {

        if (!shelfNameIsValid && !shelfLevelIsValid) {
            shelfNameBlurHandler();
            shelfLevelBlurHandler();
            return;
        }

        hideAddShelfModal();
        setIsShelfPlacing(true);
        setShelfCoords([]);
    }

    const cellClickHandler = (event) => {
        
        const coords = event.target.dataset.coords.split("-");
        setShelfCoords((prevState) => {
            return [...prevState, {x: coords[0], y: coords[1]}];
        });
    }

    const sortCoordsToShelf = () => {
        if (shelfCoords[0].x === shelfCoords[1].x) {
            if (shelfCoords[0].y >= shelfCoords[1].y) {
                return {x1:shelfCoords[1].x, y1:shelfCoords[1].y, x2:shelfCoords[0].x, y2:shelfCoords[0].y};
            } 
            return {x1:shelfCoords[0].x, y1:shelfCoords[0].y, x2:shelfCoords[1].x, y2:shelfCoords[1].y};
        } else if (shelfCoords[0].y === shelfCoords[1].y) {
            if (shelfCoords[0].x >= shelfCoords[1].x) {
                return {x1:shelfCoords[1].x, y1:shelfCoords[1].y, x2:shelfCoords[0].x, y2:shelfCoords[0].y};
            } 
            return {x1:shelfCoords[0].x, y1:shelfCoords[0].y, x2:shelfCoords[1].x, y2:shelfCoords[1].y};
        } else {
            return null;
        }
    }

    const validateShelfPlacement = (sortedCoords) => {

        if (sortedCoords === null) {
            return null;
        }

        const shelfBlocks = [];
        if (sortedCoords.x1 === sortedCoords.x2) {
            for (let y = sortedCoords.y1; y <= sortedCoords.y2; y++) {                                
                shelfBlocks.push({x:sortedCoords.x1, y:y});
            }
        } else {
            for (let x = sortedCoords.x1; x <= sortedCoords.x2; x++) {                 
                shelfBlocks.push({x:x, y:sortedCoords.y1});
            }
        }

        for (const block of shelfBlocks) {
            if (grid[block.x][block.y].shelf !== null) {
                return false;
            }
        }
        return true;
    }

    const saveShelf = async (sortedCoords) => {
        
        const data = {
            token: localStorage.getItem("token"),              
            name: shelfNameEnteredValue,
            levels: shelfLevelEnteredValue,
            x1: sortedCoords.x1,
            y1: sortedCoords.y1,
            x2: sortedCoords.x2,
            y2: sortedCoords.y2,
            LayoutId: selectedLayout
        };

        const afterSuccess = () => {
            shelfNameReset();
            shelfLevelReset();
            loadShelfs();
        }
        const generalEnd = () => {}

        customFetch("/layout/shelves/add", data, "POST", afterSuccess, generalEnd); 
    };

    useEffect(() => {
        
        if (isShelfPlacing && shelfCoords.length < 2) {
            console.log(shelfCoords);
            
        } else if (isShelfPlacing && shelfCoords.length >= 2) {
            console.log(shelfCoords);
            
            const coordsSorted = sortCoordsToShelf();
           
            if ( validateShelfPlacement(coordsSorted)) {
                saveShelf(coordsSorted);
            } else if (coordsSorted === null) {
                fireToast("Wrong placement", "error");             
            } else {
                fireToast("Shelf collision", "error");             
            }

            setIsShelfPlacing(false);
        }
    }, [shelfCoords]);

    const renderLayoutGrid = () => {
       
        const heightElementArray = [];
        for (let i = 0; i < grid.length; i++) {
            const widthElementArray = [];
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j].shelf === null) {
                    widthElementArray.push(<div key={`${i}-${j}`} data-coords={`${i}-${j}`} className={style.cell} onClick={cellClickHandler}></div>);
                } else {
                    if (grid[i][j].shelf === selectedShelf) {
                        widthElementArray.push(<div key={`${i}-${j}`} data-coords={`${i}-${j}`} className={`${style.cell} ${style.selected}`}></div>);
                    } else {
                        const colors = shelfColors[grid[i][j].shelf];
                        widthElementArray.push(<div key={`${i}-${j}`} data-coords={`${i}-${j}`} className={`${style.cell} styled`} style={{backgroundColor: `rgba(${colors.r},${colors.g},${colors.b},${0.6})`}}></div>);
                    }
                }
            }
            heightElementArray.push(<div key={i} className={style.flex}>{widthElementArray}</div>);
        }
        setLayoutGridJSX(heightElementArray);
    }

    const shelfSelectClickHandler = (id) => {
        setSelectedShelf(id);
    }

    const shelfEditClickHandler = (shelf) => {
        showAddShelfModal();
        setshelfNameEnteredValue(shelf.name);
        setshelfLevelEnteredValue(shelf.levels);
        setIsEditShelf(true);
    }

    const shelfDeleteClickHandler = () => {
        setDeleteMode("shelf");
        showDeleteModal();
    }

    const renderShelves = () => {

        return resultShelves.map((shelf) => {

            const shelfClass = selectedShelf === shelf.id ? style.selected: "";

            return (
            <div key={shelf.id} className={shelfClass} onClick={shelfSelectClickHandler.bind(null, shelf.id)}>
                <h4 className={style.m0}>{shelf.name}</h4>
                <p className={style.m0}><b>Levels:</b> {shelf.levels}</p>
                <p className={style.m0}><b>X1:</b> {shelf.x1} <b>Y1:</b> {shelf.y1} <b>X2:</b> {shelf.x2} <b>Y2:</b> {shelf.y2}</p>
                <button className={style.btnEdit} title='Edit' onClick={shelfEditClickHandler.bind(null, shelf)}><Icon size='20' icon='edit'/></button>
                <button className={style.btnDelete} title='Delete' onClick={shelfDeleteClickHandler}><Icon size='20' icon='trash'/></button>
            </div>);
        });
    }

    const loadLayouts = async () => {

        const response = await fetch("http://192.168.50.62:8080/layout/get", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"),                            
            }) 
        });
        const json = await response.json();
        console.log(json);

        setResultLayouts(json.data);
    }

    const addLayoutCLickHandler = async () => {

        if (!layoutIsValid && !widthIsValid && !heightIsValid) {
            layoutBlurHandler();
            widthBlurHandler();
            heightBlurHandler();
            return;
        }
        
        const data = {
            token: localStorage.getItem("token"),              
            name: layoutEnteredValue,
            width: widthEnteredValue,
            height: heightEnteredValue
        };

        const afterSuccess = () => {loadLayouts();}
        const generalEnd = () => {hideAddLayoutModal();}

        customFetch("/layout/add", data, "POST", afterSuccess, generalEnd); 
    }

    useEffect(() => {
        loadLayouts();
    }, []);

    useEffect(() => {
        generateLayoutGrid();
    }, [layoutHeight, layoutWidth, resultShelves]);
    
    useEffect(() => {
        loadShelfs();
    }, [selectedLayout]);

    useEffect(() => {
        renderLayoutGrid();
    }, [grid, selectedShelf]);

    const layoutDeleteClickHandler = () => {
        setDeleteMode("layout");
        showDeleteModal();
    }

    const addShelfClickHandler = () => {
        shelfNameReset();
        shelfLevelReset();
        showAddShelfModal();
        setIsEditShelf(false);
    }

    const deleteLayoutClickHandler = async () => {

        const data = {token: localStorage.getItem("token"), id: selectedLayout};

        const afterSuccess = () => {loadLayouts();}
        const generalEnd = () => {hideDeleteModal();}

        customFetch("/layout/delete", data, "DELETE", afterSuccess, generalEnd); 
    }

    const deleteShelfClickHandler = async () => {

        const data = {token: localStorage.getItem("token"), id: selectedShelf};

        const afterSuccess = () => {loadShelfs();}
        const generalEnd = () => {hideDeleteModal();}

        customFetch("/layout/shelves", data, "DELETE", afterSuccess, generalEnd); 
    }

    const saveNewNameForShelf = async () => {

        if (!shelfNameIsValid && !shelfLevelIsValid) {
            shelfNameBlurHandler();
            shelfLevelBlurHandler();
            return;
        }
        
        const data = {
            token: localStorage.getItem("token"),   
            id: selectedShelf,           
            name: shelfNameEnteredValue,              
        };

        const afterSuccess = () => {loadShelfs();}
        const generalEnd = () => {hideAddShelfModal();}

        customFetch("/layout/shelves", data, "PATCH", afterSuccess, generalEnd); 
    }

    const layoutClass = layoutHasError ? style.invalid : "";
    const widthClass = widthHasError ? style.invalid : "";
    const heightClass = heightHasError ? style.invalid : "";

    const placingShelfClass = isShelfPlacing ? `${style.container} ${style.placingShelf}`: style.container;

    const shelfClass = shelfNameHasError ? style.invalid : "";
    const levelsClass = shelfLevelHasError ? style.invalid : "";  

    const addLayoutModal = (
        <Modal onClose={hideAddLayoutModal}>
            <h3 className={style.mt0}>Add layout</h3>
            <div className={`${style.inputGroup}  ${layoutClass}`}>
                <label>Layout name</label>
                <input type="text" onInput={layoutChangeHandler} onBlur={layoutBlurHandler} value={layoutEnteredValue}/>
                <p>The field cannot be empty</p>
            </div>
            <div className={`${style.inputGroup}  ${widthClass}`}>
                <label>Width</label>
                <input type="number" onInput={widthChangeHandler} onBlur={widthBlurHandler} value={widthEnteredValue}/>
                <p>The field cannot be empty</p>
            </div>
            <div className={`${style.inputGroup}  ${heightClass}`}>
                <label>Height</label>
                <input type="number" onInput={heightChangeHandler} onBlur={heightBlurHandler} value={heightEnteredValue}/>
                <p>The field cannot be empty</p>
            </div>
            <div className={style.formBtns}>
                <button className={`${style.btn} ${style.btnSuccess}`} onClick={addLayoutCLickHandler}>Add</button>
                <button className={`${style.btn} ${style.btnDefault}`} onClick={hideAddLayoutModal}>Cancel</button>
            </div>
        </Modal>
    );

    const addShelfModal = (
        <Modal onClose={hideAddShelfModal}>
            {isEditShelf && <h3 className={style.mt0}>Edit shelf</h3>}
            {!isEditShelf && <h3 className={style.mt0}>Add shelf</h3>}
            <div className={`${style.inputGroup} ${shelfClass}`}>
                <label>Shelf name</label>
                <input type="text" onInput={shelfNameChangeHandler} onBlur={shelfNameBlurHandler} value={shelfNameEnteredValue}/>
                <p>The field cannot be empty</p>
            </div>
            <div className={`${style.inputGroup} ${levelsClass}`}>
                <label>Levels</label>
                <input type="number" onInput={shelfLevelChangeHandler} onBlur={shelfLevelBlurHandler} value={shelfLevelEnteredValue} disabled={isEditShelf}/>
                <p>This field can only be a number</p>
            </div>           
            <div className={style.formBtns}>
                {isEditShelf && <button className={`${style.btn} ${style.btnSuccess}`} onClick={saveNewNameForShelf}>Save</button>}
                {!isEditShelf && <button className={`${style.btn} ${style.btnSuccess}`} onClick={placeShelfClickHandler}>Place on layout</button>}
                <button className={`${style.btn} ${style.btnDefault}`} onClick={hideAddShelfModal}>Cancel</button>
            </div>
        </Modal>
    );

    const deleteModal = (
        <Modal onClose={hideDeleteModal}>
            {deleteMode === 'shelf' && 
            <Fragment>
                <h3 className={style.mt0}>Delete shelf</h3>
                <p>Are you sure you want to delete this shelf?</p>
                <div className={style.formBtns}>
                    <button className={`${style.btn} ${style.btnDanger}`} onClick={deleteShelfClickHandler}>Delete</button>
                    <button className={`${style.btn} ${style.btnDefault}`} onClick={hideDeleteModal}>Cancel</button>
                </div>
            </Fragment>}
            {deleteMode === 'layout' && 
            <Fragment>
                <h3 className={style.mt0}>Delete layout</h3>
                <p>Are you sure you want to delete this layout?</p>
                <div className={style.formBtns}>
                    <button className={`${style.btn} ${style.btnDanger}`} onClick={deleteLayoutClickHandler}>Delete</button>
                    <button className={`${style.btn} ${style.btnDefault}`} onClick={hideDeleteModal}>Cancel</button>
                </div>
            </Fragment>}
        </Modal>
    );
    
    return (
        <Fragment>
            {isShownAddLayoutModal && addLayoutModal}
            {isShownAddShelfModal && addShelfModal}
            {isShownDeleteModal && deleteModal}
            <div className={placingShelfClass}>
                <div className={`${style.box} ${style.mbXs}`}>
                    <div className={`${style.flex} ${style.flexSpaceBetw} ${style.mb1} ${style.alignItemsCenter}`}>
                        <h3 className={style.m0}>Choose layout:</h3>
                        <div>
                            <button className={`${style.btn} ${style.btnSuccess}`} onClick={showAddLayoutModal}>Add layout</button>
                            <button className={`${style.btn} ${style.btnDanger}`} onClick={layoutDeleteClickHandler} disabled={selectedLayout === 0}>Delete layout</button>
                        </div>
                    </div>
                    <div className={style.inputGroup}>              
                        <select onChange={onLayoutSelectChangeHandler}>
                            <option value={0}>Please choose a layout...</option>
                            {generateLayoutOptions()}
                        </select>
                    </div>
                </div>

                <div className={`${style.flex}`}>
                    <div className={`${style.box} ${style.w70} ${style.layout}`}>
                        <p className={style.placingTip}>Please select the start end end point of shelf! (Click on the first coordinate than click on the second coordinate)</p>
                        {layoutHeight === 0 && <p className={style.mt0}>Layout can not be rendered...</p>}
                        {layoutGridJSX}
                    </div>
                    <div className={`${style.box} ${style.w30} ${style.mlXs}`}>
                        <div className={`${style.flex} ${style.flexSpaceBetw} ${style.mb1} ${style.alignItemsCenter}`}>
                            <h3 className={style.m0}>Shelves:</h3>
                            <button key='button1' className={`${style.btn} ${style.btnSuccess}`} onClick={addShelfClickHandler}>Add shelf</button>
                        </div>
                        <div className={`${style.shelves}`}>
                            {resultShelves.length === 0 && <p className={style.mt0}>Shelves can not be rendered...</p>}
                            {resultShelves.length > 0 && renderShelves()}                       
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Layout;