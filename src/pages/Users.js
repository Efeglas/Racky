import style from './Users.module.css';

import { Fragment, useState, useEffect } from "react";
import Icon from '../icons/Icon';
import useModal from '../hooks/use-Modal';
import Modal from '../components/modal/Modal';
import useInput from '../hooks/use-Input';
import { toast } from 'react-toastify';

const Users = () => {

    const [resultUsers, setResultUsers] = useState();
    const [resultRoles, setResultRoles] = useState();
    const [selectedUser, setSelectedUser] = useState({});
    const [selectedRoleValue, setSelectedRoleValue] = useState(1);

    const [userFilter, setUserFilter] = useState("");
    const [userFilterInput, setUserFilterInput] = useState("");

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
        isShown: isShownConfirmModal,
        hide: hideConfirmModal,
        show: showConfirmModal
    } = useModal();

    const [username, setUsername] = useState("");

    const {
        value: firstNameEnteredValue,
        setValue: setfirstNameEnteredValue,
        isValid: firstNameIsValid,
        hasError: firstNameHasError,
        changeHandler: firstNameChangeHandler,
        blurHandler:firstNameBlurHandler,
        reset: firstNameReset,
    } = useInput(value => value.trim() !== "");

    const {
        value: lastNameEnteredValue,
        setValue: setlastNameEnteredValue,
        isValid: lastNameIsValid,
        hasError: lastNameHasError,
        changeHandler: lastNameChangeHandler,
        blurHandler:lastNameBlurHandler,
        reset: lastNameReset,
    } = useInput(value => value.trim() !== "");

    const {
        value: emailEnteredValue,
        setValue: setemailEnteredValue,
        isValid: emailIsValid,
        hasError: emailHasError,
        changeHandler: emailChangeHandler,
        blurHandler:emailBlurHandler,
        reset: emailReset,
    } = useInput(value => value.trim() !== "");

    const {
        value: phoneEnteredValue,
        setValue: setphoneEnteredValue,
        isValid: phoneIsValid,
        hasError: phoneHasError,
        changeHandler: phoneChangeHandler,
        blurHandler:phoneBlurHandler,
        reset: phoneReset,
    } = useInput(value => value.trim() !== "");

    const loadUsers = async () => {
        const response = await fetch("http://192.168.50.62:8080/user/get", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token: localStorage.getItem("token")}) 
        });
        const json = await response.json();
        console.log(json);
        setResultUsers(json.data);     
    }

    const loadRoles = async () => {

        const response = await fetch("http://192.168.50.62:8080/role/plain", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({token: localStorage.getItem("token")}) 
            });
            const json = await response.json();
            console.log(json);
            setResultRoles(json.data);
    }

    useEffect(() => {
        
        loadUsers();
        loadRoles();
    }, []);

    const userEditOnClickHandler = (user) => {
        setSelectedUser(user);
        setIsLocked(true);
        setIsEdit(true);
        console.log(selectedUser);
        setSelectedRoleValue(user.Role.id);
        setUsername(user.username);

        setfirstNameEnteredValue(user.firstName);
        setlastNameEnteredValue(user.lastName);
        setemailEnteredValue(user.email);
        setphoneEnteredValue(user.phone);

        showEditModal();
    }

    const searchOnClickHandler = () => {
        setUserFilter(userFilterInput);
    }

    const searchOnKeyDownHandler = (event) => {
        if (event.key === "Enter") {
            setUserFilter(userFilterInput);
        }

        if (event.keyCode === 8) {
            setUserFilter("");
        }
    }

    const deleteOnClickHandler = async () => {
        
        const response = await fetch("http://192.168.50.62:8080/user/delete", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"),
                id: selectedUser.id,             
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
            loadUsers();
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
        const response = await fetch("http://192.168.50.62:8080/user/edit", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"),
                id: selectedUser.id,
                email:emailEnteredValue,
                firstName:firstNameEnteredValue,
                lastName:lastNameEnteredValue,
                phone:phoneEnteredValue,
                role:selectedRoleValue,
            }) 
        });
        const json = await response.json();
        console.log(json);

        if (response.ok) {
            toast.success('User edited', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            loadUsers();
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

    const registerOnClickHandler = async () => {
        
        const response = await fetch("http://192.168.50.62:8080/user/register", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"),              
                email:emailEnteredValue,
                firstName:firstNameEnteredValue,
                lastName:lastNameEnteredValue,
                phone:phoneEnteredValue,
                role:selectedRoleValue,
            }) 
        });
        const json = await response.json();
        console.log(json);

        if (response.ok) {
            toast.success('User added', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            loadUsers();
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

    const initResetPassClickHandler = () => {
        hideEditModal();
        showConfirmModal();
    }

    const finalizeResetPassClickHandler = async () => {
        
        const response = await fetch("http://192.168.50.62:8080/user/password/reset", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"),              
                id: selectedUser.id,
                username: selectedUser.username
            }) 
        });
        const json = await response.json();
        console.log(json);

        if (response.ok) {
            toast.success('User password reset', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            loadUsers();
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

        hideConfirmModal();
    }

    //? PAGE REG BUTTON
    const userRegOnClickHandler = () => {
        setIsEdit(false);
        setIsLocked(false);
        setUsername("");
        setSelectedRoleValue(1);
        firstNameReset();
        lastNameReset();
        emailReset();
        phoneReset();
        showEditModal();
    }

    const userDeleteOnClickHandler = (user) => {
        setSelectedUser(user);
        showDeleteModal();
    }

    const searchOnChangeHandler = (event) => {
        setUserFilterInput(event.target.value);
    }

    const generateTRs = (data) => {

        return data.map((user) => {       
            return (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{`${user.lastName} ${user.firstName}`}</td>
                    <td>{user.Role.name}</td>
                    <td>                     
                        <button className={style.btnEdit} title='Edit' onClick={userEditOnClickHandler.bind(null, user)}><Icon size='20' icon='edit'/></button>
                        <button className={style.btnDelete} title='Delete' onClick={userDeleteOnClickHandler.bind(null, user)}><Icon size='20' icon='trash'/></button>
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

    if (resultRoles !== undefined) {
        selectOptions = generateSelectOptions(resultRoles);
    }

    const filterIsInUserObj = (user) => {

        const filterLowerCase = userFilter.toLowerCase();

        if (user.username.toLowerCase().includes(filterLowerCase) || 
            user.email.toLowerCase().includes(filterLowerCase) ||
            user.firstName.toLowerCase().includes(filterLowerCase) ||
            user.lastName.toLowerCase().includes(filterLowerCase) ||
            `${user.lastName} ${user.firstName}`.toLowerCase().includes(filterLowerCase) ||
            user.Role.name.toLowerCase().includes(filterLowerCase) || 
            user.phone.toLowerCase().includes(filterLowerCase)) {
                return true;
            } 
            return false;
    }

    let tbody = <tr><td colSpan='4' className={style.textCenter}>No data available...</td></tr>;

    if (resultUsers !== undefined) {
        const filteredUsers = resultUsers.filter(filterIsInUserObj);

        if (filteredUsers.length > 0) {
            tbody = generateTRs(filteredUsers);
        } else {
            tbody = <tr><td colSpan='4' className={style.textCenter}>No data available...</td></tr>;
        }
    }

    const unlockClickHandler = () => {
        setIsLocked(!isLocked);
    }

    const selectOnChangeHandler = (event) => {
        setSelectedRoleValue(event.target.value);
    }

     const firstNameClass = firstNameHasError && !isLocked ? style.invalid : "";
     const lastNameClass = lastNameHasError && !isLocked? style.invalid : "";
     const emailClass = emailHasError && !isLocked? style.invalid : "";
     const phoneClass = phoneHasError && !isLocked? style.invalid : "";

    const editModal = (
        <Modal onClose={hideEditModal}>
            <div className={`${style.flex} ${style.flexSpaceBetw}`}>
                <h3 className={style.mt0}>User data, edit user</h3>
                {isEdit && <button className={`${style.btn} ${style.btnDefault}`} onClick={unlockClickHandler} title='Unlock/lock edit'>
                    {isLocked && <Icon  size='20' icon='lock'/>}
                    {!isLocked && <Icon  size='20' icon='openlock'/>}
                </button>}
            </div>
            {isEdit && <div className={`${style.inputGroup}`}>
                <label>Username</label>
                <input type="text" value={username} disabled={true}/>
                <p>The field cannot be empty</p>
            </div>}
            <div className={`${style.inputGroup} ${firstNameClass}`}>
                <label>First name</label>
                <input type="text" onInput={firstNameChangeHandler} onBlur={firstNameBlurHandler} value={firstNameEnteredValue} disabled={isLocked}/>
                <p>The field cannot be empty</p>
            </div>
            <div className={`${style.inputGroup}  ${lastNameClass}`}>
                <label>Last name</label>
                <input type="text" onInput={lastNameChangeHandler} onBlur={lastNameBlurHandler} value={lastNameEnteredValue} disabled={isLocked}/>
                <p>The field cannot be empty</p>
            </div>
            <div className={`${style.inputGroup}  ${emailClass}`}>
                <label>Email</label>
                <input type="text" onInput={emailChangeHandler} onBlur={emailBlurHandler} value={emailEnteredValue} disabled={isLocked}/>
                <p>The field cannot be empty</p>
            </div>
            <div className={`${style.inputGroup}  ${phoneClass}`}>
                <label>Phone</label>
                <input type="text" onInput={phoneChangeHandler} onBlur={phoneBlurHandler} value={phoneEnteredValue} disabled={isLocked}/>
                <p>The field cannot be empty</p>
            </div>
            <div className={style.inputGroup}>
                <label>Role</label>
                <select disabled={isLocked} value={selectedRoleValue} onChange={selectOnChangeHandler}>
                    {selectOptions}
                </select>
            </div>
            <div className={style.formBtns}>
            

                {isEdit && <button className={`${style.btn} ${style.btnWarning}`} onClick={initResetPassClickHandler}>Reset password</button>}  
                {isEdit && <button className={`${style.btn} ${style.btnSuccess}`} onClick={saveEditOnClickHandler}>Save</button>}  
                {!isEdit && <button className={`${style.btn} ${style.btnSuccess}`} onClick={registerOnClickHandler}>Register</button>}     
                <button className={`${style.btn} ${style.btnDefault}`} onClick={hideEditModal}>Cancel</button>        
            </div>
        </Modal>
    );

   

   /*  const registerModal = (
        <Modal onClose={hideRegisterModal}>
            <h3 className={style.mt0}>Register user</h3>
            <div className={`${style.inputGroup} ${roleNamePwClass}`}>
                <label>First name</label>
                <input type="text" onInput={""} onBlur={""} value={""}/>
                <p>The field cannot be empty</p>
            </div>
            <div className={`${style.inputGroup} ${roleNamePwClass}`}>
                <label>Last name</label>
                <input type="text" onInput={""} onBlur={""} value={""}/>
                <p>The field cannot be empty</p>
            </div>
            <div className={`${style.inputGroup} ${roleNamePwClass}`}>
                <label>Email</label>
                <input type="text" onInput={""} onBlur={""} value={""}/>
                <p>The field cannot be empty</p>
            </div>
            <div className={`${style.inputGroup} ${roleNamePwClass}`}>
                <label>Phone</label>
                <input type="text" onInput={""} onBlur={""} value={""}/>
                <p>The field cannot be empty</p>
            </div>
            <div className={style.inputGroup}>
                <label>Role</label>
                <select>
                    <option value={1}>Admin</option>
                    <option value={2}>Default</option>
                </select>
            </div>
            <div className={style.formBtns}>
                <button className={`${style.btn} ${style.btnSuccess}`} onClick={""}>Register</button>              
            </div>
        </Modal>
    ); */

    const deleteModal = (
        <Modal onClose={hideDeleteModal}>
          <h3 className={style.mt0}>Delete {`${selectedUser.lastName} ${selectedUser.firstName}`} user</h3>
            <p>Are you sure you want to delete this user?</p>
            <div className={style.formBtns}>
                <button className={`${style.btn} ${style.btnDanger}`} onClick={deleteOnClickHandler}>Delete</button>
                <button className={`${style.btn} ${style.btnDefault}`} onClick={hideDeleteModal}>Cancel</button>
            </div>
        </Modal>
    );

    const confirmModal = (
        <Modal onClose={hideConfirmModal}>
          <h3 className={style.mt0}>Reset {`${selectedUser.lastName} ${selectedUser.firstName}`} password</h3>
            <p>Are you sure you want to reset this users password?</p>
            <div className={style.formBtns}>
                <button className={`${style.btn} ${style.btnWarning}`} onClick={finalizeResetPassClickHandler}>Reset</button>
                <button className={`${style.btn} ${style.btnDefault}`} onClick={hideConfirmModal}>Cancel</button>
            </div>
        </Modal>
    );

    return (
        <Fragment>
            {isShownEditModal && editModal}
            {isShownDeleteModal && deleteModal}   
            {isShownConfirmModal && confirmModal}        
            <div className={style.container}>
                <div className={`${style.flex} ${style.flexEnd} ${style.mb1}`}>                  
                        <div className={style.inputGroup}>
                            <input type='text' placeholder='Search...' value={userFilterInput} onChange={searchOnChangeHandler} onKeyDown={searchOnKeyDownHandler}/>
                        </div>                
                    <button className={`${style.btn} ${style.btnDefault}`} onClick={searchOnClickHandler}>Search</button>
                    <button className={`${style.btn} ${style.btnSuccess}`} onClick={userRegOnClickHandler}>Register user</button>
                </div>
                <div className={style.roles}>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Full name</th>
                                <th>Role</th>
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

export default Users;