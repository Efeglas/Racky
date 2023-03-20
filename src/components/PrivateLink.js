const PrivateLink = (props) => {

    const getPermissions = () => {
        const localPermString = localStorage.getItem('permissions');
        const permArray = localPermString.split(',');
        for (const p of props.permission) {
            if (permArray.includes(p.toString())) {
                return true;
            }           
        }
        return false;
    }

    if (getPermissions()) {
        return props.children;
    }
}

export default PrivateLink;