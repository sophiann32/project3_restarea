// import {useParams} from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import React from "react";


function ChartDonut({ stations }) {
    ChartJS.register(ArcElement, Tooltip, Legend);

    let labels = [];
    if (stations.length > 0) {
        labels = stations.map((station) => station.name);
    }
    // console.log(labels)
    let price = [];
    if (stations.length > 0) {
        price = stations.map((station) => station.price);
    }
    // console.log(price)
    const combinedData = labels.map((label, index) => (`${label} : ${price[index]}`));
    // const maxDataValue = 15; // 최대 데이터 값
    const chartData = {

        labels: combinedData,
        datasets: [
            {
                label: '가격',
                data: price.map((price) => parseInt(price)), // 가격 데이터를 사용하여 데이터 생성
                backgroundColor: labels.map((_, index) => `hsl(${60 + index * 10}, 80%, ${65 - index * 3}%)`),
                borderColor: Array.from({ length: labels.length }, () => 'green'),
                borderWidth: 1,
            }
        ]
    };
    return (
        <div className="App">
            <div style={{width: '20%', margin: 'auto'}}>
                <canvas id="salesChart"></canvas>
                <Doughnut data={chartData}/>
            </div>
        </div>
    );
}

export default ChartDonut;
