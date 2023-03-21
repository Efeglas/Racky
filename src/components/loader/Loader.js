import Icon from '../../icons/Icon';
import style from './Loader.module.css';

const Loader = () => {
    return (
        <div className={style.loader}>
            <Icon size='50' icon='spinner'/>
        </div>
    );
}
export default Loader;