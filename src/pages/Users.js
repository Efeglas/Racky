import style from './Users.module.css';

import { Fragment, useState, useEffect } from "react";
import Icon from '../icons/Icon';
import useModal from '../hooks/use-Modal';
import Modal from '../components/modal/Modal';

const Users = () => {

    const [resultUsers, setResultUsers] = useState();
    const [resultRoles, setResultRoles] = useState();
    const [selectedUser, setSelectedUser] = useState({});

    const [userFilter, setUserFilter] = useState("");
    const [userFilterInput, setUserFilterInput] = useState("");

    const [isLocked, setIsLocked] = useState(true);

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
        isShown: isShownRegisterModal,
        hide: hideRegisterModal,
        show: showRegisterModal
    } = useModal();

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

    const deleteOnClickHandler = () => {
        //TODO delete fetch
    }

    const saveEditOnClickHandler = () => {
        //TODO edit fetch
    }

    const registerOnClickHandler = () => {
        //TODO edit fetch
    }

    const userRegOnClickHandler = () => {
        showRegisterModal();
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

    const editModal = (
        <Modal onClose={hideEditModal}>
            <div className={`${style.flex} ${style.flexSpaceBetw}`}>
                <h3 className={style.mt0}>User data, edit user</h3>
                <button className={`${style.btn} ${style.btnDefault}`} onClick={unlockClickHandler} title='Unlock/lock edit'>
                    {isLocked && <Icon  size='20' icon='lock'/>}
                    {!isLocked && <Icon  size='20' icon='openlock'/>}
                </button>
            </div>
            <div className={`${style.inputGroup}`}>
                <label>Username</label>
                <input type="text" onInput={""} onBlur={""} value={""} disabled={isLocked}/>
                <p>The field cannot be empty</p>
            </div>
            <div className={`${style.inputGroup}`}>
                <label>First name</label>
                <input type="text" onInput={""} onBlur={""} value={""} disabled={isLocked}/>
                <p>The field cannot be empty</p>
            </div>
            <div className={`${style.inputGroup}`}>
                <label>Last name</label>
                <input type="text" onInput={""} onBlur={""} value={""} disabled={isLocked}/>
                <p>The field cannot be empty</p>
            </div>
            <div className={`${style.inputGroup}`}>
                <label>Email</label>
                <input type="text" onInput={""} onBlur={""} value={""} disabled={isLocked}/>
                <p>The field cannot be empty</p>
            </div>
            <div className={`${style.inputGroup}`}>
                <label>Phone</label>
                <input type="text" onInput={""} onBlur={""} value={""} disabled={isLocked}/>
                <p>The field cannot be empty</p>
            </div>
            <div className={style.inputGroup}>
                <label>Role</label>
                <select disabled={isLocked}>
                    <option value={1}>Admin</option>
                    <option value={2}>Default</option>
                </select>
            </div>
            <div className={style.formBtns}>
                <button className={`${style.btn} ${style.btnWarning}`} onClick={""}>Reset password</button>    
                <button className={`${style.btn} ${style.btnSuccess}`} onClick={""}>Save</button>              
            </div>
        </Modal>
    );

    //TODO
    const roleNamePwClass = false ? style.invalid : "";

    const registerModal = (
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
    );

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

    return (
        <Fragment>
            {isShownEditModal && editModal}
            {isShownDeleteModal && deleteModal}
            {isShownRegisterModal && registerModal}
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