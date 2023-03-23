import { Fragment, Suspense, useState, useEffect } from "react";
import { defer, Await, useLoaderData, useNavigate } from "react-router-dom";
import style from './Roles.module.css';
import Icon from "../icons/Icon";
import useModal from "../hooks/use-Modal";
import useInput from "../hooks/use-Input";
import Modal from '../components/modal/Modal'
import Loader from "../components/loader/Loader";
import { toast } from 'react-toastify';

const Roles = () => {

    //const {roles, permissions} = useLoaderData();
    const [selectedRole, setSelectedRole] = useState({id: null, name: null, Permissions: null});
    const navigate = useNavigate();
    const [permissionData, setPermissionData] = useState();
    const [roleData, setRoleData] = useState();
    const [permCheckList, setPermCheckList] = useState();
    const [isAddRole, setIsAddRole] = useState(false);
    //console.log(permissionData);

    const loadPermissions = async () => {
        const response = await fetch("http://192.168.50.62:8080/role/permissions", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token: localStorage.getItem("token")}) 
        });
        const json = await response.json();
        console.log(json);
        setPermissionData(json.data);

        const obj = {};
        json.data.forEach((element) => {
            obj[element.id] = {...element, value: false};
        });
        setPermCheckList(obj);

        //return json;
    }

    const loadRoles = async () => {
        const response = await fetch("http://192.168.50.62:8080/role", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({token: localStorage.getItem("token")}) 
            });
            const json = await response.json();
            console.log(json);
            setRoleData(json.data);
            //return json;
    }

    

    useEffect(() => {
        //setPermissionData(permissions);
        loadPermissions();
        loadRoles();
    }, []);

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
        isShown: isShownPermissionModal,
        hide: hidePermissionModal,
        show: showPermissionModal
    } = useModal();

    const {
        value: roleNameEnteredValue,
        setValue: setRoleNameEnteredValue,
        isValid: roleNameIsValid,
        hasError: roleNameHasError,
        changeHandler: roleNameChangeHandler,
        blurHandler:roleNameBlurHandler,
        reset: roleNameReset,
    } = useInput(value => value.trim() !== "");

    
    const renameClickHandler = (role) => {
        setIsAddRole(false);
        setSelectedRole(role);
        console.log(role.name);
        setRoleNameEnteredValue(role.name);
        showEditModal();
    }
    
    const deleteClickHandler = (role) => {
        setSelectedRole(role);
        showDeleteModal();
        
    }

   /*  if (permissionData !== undefined) {
        
        let permissionList = <p className={style.textCenter}>No data available...</p>;
    } */
   
    const checklistClickHandler = (role) => {
        setSelectedRole(role);
        showPermissionModal();

  //      permCheckList
//setPermCheckList
        //console.log(permCheckList);
        const newPermObj = {};
        const rolePermArray = role.Permissions.map((p) => {
            return p.id;
        });

        //console.log(rolePermArray);
        for (const key in permCheckList) {

            newPermObj[key] = permCheckList[key];
            if (rolePermArray.includes(Number(key))) {
                newPermObj[key].value = true;
            } else {
                newPermObj[key].value = false;
            }                    
        }

        setPermCheckList(newPermObj);

        /* if (permissionData !== undefined && permissionData.length > 0) {
            
            setPermCheckList(permissionData.map((permission) => {
                return (<div>
                    <label htmlFor={`permCheck${permission.id}`}>{permission.name}</label>
                    <input type='checkbox' name={`permCheck${permission.id}`} checked={rolePermArray.includes(permission.id) ? true : false}/>
                </div>);
            }));
            //console.log(permissionList);
        }  */
        /* console.log(permissionData);
        
        console.log(permissions);
        permissionJSX = <Suspense fallback={<Loader />}>
            <Await resolve={permissions} errorElement={<p colSpan='3' className={style.textCenter}>Can't load data...</p>} children={
                (loadedData) => {     
                    if (loadedData.data !== undefined && loadedData.data.length > 0) {
                        return permissions.data.map((permission) => {
                            return (<div>
                                <label htmlFor={`permCheck${permission.id}`}>{permission.name}</label>
                                <input type='checkbox' name={`permCheck${permission.id}`} checked={rolePermArray.includes(permission.id) ? true : false}/>
                            </div>);
                        });
                    } else {
                        return (<tr><td colSpan='3' className={style.textCenter}>No data available...</td></tr>);
                    }
                }
            }/>
        </Suspense> */
        /* permissionJSX = permissions.data.map((permission) => {
            return (<div>
                <label htmlFor={`permCheck${permission.id}`}>{permission.name}</label>
                <input type='checkbox' name={`permCheck${permission.id}`} checked={rolePermArray.includes(permission.id) ? true : false}/>
            </div>);
        }); */
    }
    console.log(permCheckList);
    //console.log(permissionList);

    const editSaveOnClickHandler = async () => {

        if (!roleNameIsValid) {
            return;
        } 

        const response = await fetch("http://192.168.50.62:8080/role/rename", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token: localStorage.getItem("token"), id: selectedRole.id, name: roleNameEnteredValue}) 
        });
        const json = await response.json();
        console.log(json);
        
        if (response.ok) {
            toast.success('Role edited', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            loadRoles();
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

    const permissionSaveClickHandler = async () => {
        console.log(permCheckList);

        const response = await fetch("http://192.168.50.62:8080/role/permissions/save", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token: localStorage.getItem("token"), role: selectedRole.id, checks: permCheckList}) 
        });
        const json = await response.json();
        console.log(json);

        if (response.ok) {
            toast.success('Permissions saved', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            loadRoles();
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

        hidePermissionModal(); 
    }

    const generateTRs = (data) => {

        return data.map((role) => {       
            return (
                <tr key={role.id}>
                    <td>{role.id}</td>
                    <td>{role.name}</td>
                    <td>
                        <button className={style.btnPerm} title='Permissions' onClick={checklistClickHandler.bind(null, role)}><Icon size='20' icon='checklist'/></button>
                        <button className={style.btnEdit} title='Rename' onClick={renameClickHandler.bind(null, role)}><Icon size='20' icon='edit'/></button>
                        <button className={style.btnDelete} title='Delete' onClick={deleteClickHandler.bind(null, role)}><Icon size='20' icon='trash'/></button>
                    </td>
                </tr>);
        });
    }

    const checkOnChangeHandler = (id) => {
        setPermCheckList((prevState) => {
            let obj = {...prevState};
            obj[id].value = !obj[id].value;
            return obj;
        })
    }

    const generatePermCheckList = () => {
        let jsx = [];
        for (const key in permCheckList) {
            
            jsx.push(
            <tr key={permCheckList[key].id}>
                <td>
                    <input type='checkbox' id={`permCheck${permCheckList[key].id}`} checked={permCheckList[key].value} onChange={checkOnChangeHandler.bind(null, permCheckList[key].id)}/>
                </td>
                <td>
                    <label htmlFor={`permCheck${permCheckList[key].id}`}>{permCheckList[key].name}</label>
                </td>
                <td>{permCheckList[key].description}</td>
            </tr>);
        }
        return jsx;
    }

    let tbody = <tr><td colSpan='3' className={style.textCenter}>No data available...</td></tr>;
    
    if (roleData !== undefined && roleData.length > 0) {
        tbody = generateTRs(roleData);
    } 

    const roleNamePwClass = roleNameHasError ? style.invalid : "";

    const addRoleSaveClickHandler = async () => {

        const response = await fetch("http://192.168.50.62:8080/role/add", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token: localStorage.getItem("token"), name: roleNameEnteredValue}) 
        });
        const json = await response.json();
        console.log(json);

        if (response.ok) {
            toast.success('Role added', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            loadRoles();
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

    const editModal = (
      <Modal onClose={hideEditModal}>
        <h3 className={style.mt0}>{isAddRole ? "Add role": "Rename role"}</h3>
        <div className={`${style.inputGroup} ${roleNamePwClass}`}>
          <label>Role name</label>
          <input type="text" onInput={roleNameChangeHandler} onBlur={roleNameBlurHandler} value={roleNameEnteredValue}/>
          <p>The field cannot be empty</p>
        </div>
        <div className={style.formBtns}>
            {isAddRole && <button className={`${style.btn} ${style.btnSuccess}`} onClick={addRoleSaveClickHandler}>Add</button>}
            {!isAddRole && <button className={style.btn} onClick={editSaveOnClickHandler}>Save</button>}
        </div>
      </Modal>
    );

    const onDeleteRoleClickHandler = async () => {

        const response = await fetch("http://192.168.50.62:8080/role/delete", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token: localStorage.getItem("token"), role: selectedRole.id}) 
        });
        const json = await response.json();
        console.log(json);

        if (response.ok) {
            toast.success('Role deleted', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            loadRoles();
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

    const deleteModal = <Modal onClose={hideDeleteModal}>
        <h3 className={style.mt0}>Delete {selectedRole.name} role</h3>
        <p>Are you sure you want to delete this role?</p>
        <div className={style.formBtns}>
            <button className={`${style.btn} ${style.btnDanger}`} onClick={onDeleteRoleClickHandler}>Delete</button>
            <button className={`${style.btn} ${style.btnDefault}`} onClick={hideDeleteModal}>Cancel</button>
        </div>
    </Modal>;

    const permissionModal = <Modal onClose={hidePermissionModal}>
        <h3 className={style.mt0}>{selectedRole.name} role permissions</h3>
        <table className={style.checkTable}>
            <thead>
                <tr>
                    <th></th>
                    <th>Permission</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                {generatePermCheckList()}
            </tbody>
        </table>
        <div className={style.formBtns}>
            <button className={style.btn} onClick={permissionSaveClickHandler}>Save</button>
        </div>
    </Modal>;

    const addRoleClickHandler = () => {
        setIsAddRole(true);
        showEditModal();
    }

    

    return (
        <Fragment>
            {isShownEditModal && editModal}
            {isShownDeleteModal && deleteModal}
            {isShownPermissionModal && permissionModal}
            <div className={style.container}>
                <div className={`${style.flex} ${style.flexEnd} ${style.mb1}`}>
                    <button className={`${style.btn} ${style.btnSuccess}`} onClick={addRoleClickHandler}>Add role</button>
                </div>
                <div className={style.roles}>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tbody}                                                       
                        </tbody>
                    </table>
                </div>
            </div>
            <ul>
                <li>Szerepkörök felvétele</li>
                <li>Szerepkörök Átnevezése</li>
                <li>Szerepkörök törlése (ha nincs hozzácsatolva senki)</li>
                <li>Szerepkörökhöz jogosultságok beállítása</li>
            </ul>
        </Fragment>
    );
}

export default Roles;