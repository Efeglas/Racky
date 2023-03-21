import { Fragment } from "react";

const Users = () =>{
    return (
        <Fragment>
            <ul>
                <li>Felhasználók regisztrálása</li>
                <li>Felhasználók adatainak módosítása</li>
                <li>Felhasználók törlése</li>
                <li>Felhasználók jogosultságainak beállítása</li>
                <li>Felhasználók jelszó visszaállítása</li>
            </ul>
        </Fragment>
    );
}

export default Users;