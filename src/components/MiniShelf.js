import style from './MiniShelf.module.css';

const MiniShelf = (props) => {

    //props.inventory
    const jsx = [];
    for (let i = 1; i <= props.inventory.Shelf.levels; i++) {       
        if (i === props.inventory.shelflevel) {
            jsx.unshift(<div key={i} className={style.active}></div>);
        } else {
            jsx.unshift(<div key={i}></div>);
        }
    }

    return (
        <div className={style.shelf}>
            {jsx}
        </div>
    );
}

export default MiniShelf;