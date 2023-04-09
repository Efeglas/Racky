import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Line } from 'react-chartjs-2';
import style from './PriceStat.module.css';
import useInput from '../../hooks/use-Input';
import { useState, useEffect } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Item prices',
    },
  },
};

const PriceStat = () => {

    const [response, setResponse] = useState({});
    const [items, setItems] = useState([]);

    const {
        value: selectedItemEnteredValue,
        setValue: setselectedItemEnteredValue,
        isValid: selectedItemIsValid,
        hasError: selectedItemHasError,
        changeHandler: selectedItemChangeHandler,
        blurHandler:selectedItemBlurHandler,
        reset: selectedItemReset,
    } = useInput(value => value !== "0");

    let data = {
    labels: [],
    datasets: [
        {
        label: 'Price',
        data: [0],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },     
    ],
    };

    if (response !== undefined) {
        data = {
            labels: response.labels,
            datasets: [
                {
                label: 'Price',
                data: response.prices,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },     
            ],
            };
    }

    const loadStat = async () => {
        if (selectedItemEnteredValue !== "0") {
            const response = await fetch(`http://192.168.50.62:8080/stat/prices?token=${localStorage.getItem("token")}&id=${selectedItemEnteredValue}`);
            const json = await response.json();
            setResponse(json.data);
        }
    }

    const loadItems = async () => {
        const responseItems = await fetch("http://192.168.50.62:8080/item/get", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token: localStorage.getItem("token")}) 
        });
        const jsonItems = await responseItems.json();
        setItems(jsonItems.data);
    }

    useEffect(() => {
        loadStat();
    }, [selectedItemEnteredValue]);

    useEffect(() => {
        loadItems();
    }, []);

    let itemOptions = [<option value={0}>Choose an item...</option>];
    if (items !== undefined) {
        items.forEach((item) => {
            itemOptions.push(<option value={item.id}>{item.name}</option>);
        })
    }

    return (
        <div className={style.box}>           
            <div className={`${style.inputGroup}`}>
                <label>Items</label>
                <select value={selectedItemEnteredValue} onChange={selectedItemChangeHandler}>{itemOptions}</select>
            </div>               
            <Line options={options} data={data} />
        </div>
    );
}

export default PriceStat;