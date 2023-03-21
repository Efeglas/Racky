import { Fragment } from "react";

const Roles = () =>{
    return (
        <Fragment>
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