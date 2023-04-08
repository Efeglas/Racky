import OrderStat from "../components/stats/OrderStat";
import PriceStat from "../components/stats/PriceStat";
import style from "./Stat.module.css";
const Statistics = () => {

   

    return (       
        <div className={style.container}>
                <OrderStat />
                <PriceStat />
        </div>      
    );
}

export default Statistics;