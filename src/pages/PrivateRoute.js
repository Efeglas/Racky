import { Navigate } from "react-router-dom";

const PrivateRoute = (props) => {

    const token = localStorage.getItem('token');

    if (token === null) {
        return <Navigate to={props.to} />
    } else {
        return props.children;
    }
}

export default PrivateRoute;