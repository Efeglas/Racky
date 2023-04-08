import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import style from './OrderStat.module.css';
import useInput from '../../hooks/use-Input';
import useValidate from '../../hooks/use-Validate';
import { useEffect, useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  plugins: {
    title: {
      display: true,
      text: 'Orders',
    },
  },
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  scales: {
    x: {
      stacked: false,
    },
    y: {
      stacked: false,
    },
  },
};
  

const OrderStat = () => {

    const [response, setResponse] = useState({});
   
    let data = {
        labels: ["Loading..."],
        datasets: [
            {
            label: 'Loading..',
            data: [],
            backgroundColor: 'rgb(255, 99, 132)',      
            },
        ]
    };

    if (response !== undefined) {
        
        data = {
        labels: response.labels,
        datasets: [
            {
            label: 'IN',
            data: response.dataIn,
            backgroundColor: 'rgb(255, 99, 132)',      
            },
            {
            label: 'OUT',
            data: response.dataOut,
            backgroundColor: 'rgb(75, 192, 192)',      
            },   
        ],
        };
    }

    const {notEmpty: validateNotEmpty} = useValidate();

    const {
        value: fromEnteredValue,
        setValue: setfromEnteredValue,
        isValid: fromIsValid,
        hasError: fromHasError,
        changeHandler: fromChangeHandler,
        blurHandler:fromBlurHandler,
        reset: fromReset,
    } = useInput(() => {});

    const {
        value: toEnteredValue,
        setValue: settoEnteredValue,
        isValid: toIsValid,
        hasError: toHasError,
        changeHandler: toChangeHandler,
        blurHandler:toBlurHandler,
        reset: toReset,
    } = useInput(() => {});

    const loadStats = async () => {
        
        if (fromEnteredValue !== "" && toEnteredValue !== "") {
            const response = await fetch(`http://192.168.50.62:8080/stat/orders?token=${localStorage.getItem("token")}&from=${fromEnteredValue}&to=${toEnteredValue}`);
            const json = await response.json();
            console.log(json);
            setResponse(json.data);
        }
    }

    const firstDayOfTheYear = (year) => {
        const firstDayOfYear = new Date(year, 0, 1, 8);
        const formattedDate = firstDayOfYear.toISOString().slice(0, 10);  
        return formattedDate;
    }

    const lastDayOfTheYear = (year) => {
        const lastDayOfYear = new Date(year, 11, 31, 8);
        const formattedDate = lastDayOfYear.toISOString().slice(0, 10);    
        return formattedDate;
    }

    useEffect(() => {
        setfromEnteredValue(firstDayOfTheYear(new Date().getFullYear()));
        settoEnteredValue(lastDayOfTheYear(new Date().getFullYear()));
    }, []);

    useEffect(() => {
        loadStats();
    }, [fromEnteredValue, toEnteredValue]);

    return (
        <div className={style.box}>
            <div className={style.fromTo}>
                <div className={`${style.inputGroup}`}>
                    <label>From</label>
                    <input type="date" value={fromEnteredValue} onInput={fromChangeHandler} onBlur={fromBlurHandler}/>
                    <p>The field cannot be empty</p>
                </div> 
                <div className={`${style.inputGroup}`}>
                    <label>To</label>
                    <input type="date" value={toEnteredValue} onInput={toChangeHandler} onBlur={toBlurHandler}/>
                    <p>The field cannot be empty</p>
                </div>                     
            </div>
            <Bar options={options} data={data} />
        </div>
    );
}

export default OrderStat;

