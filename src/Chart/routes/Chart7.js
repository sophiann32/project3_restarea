import React, {useEffect, useState} from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';
import axios from "axios";

function ChartLine() {
    ChartJS.register(
        LinearScale,
        CategoryScale,
        BarElement,
        PointElement,
        LineElement,
        Legend,
        Tooltip,
        LineController,
        BarController

    );

    const [oilData, setOilData] = useState({});

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/api/avgRecentPrice')
            .then(response => {
                setOilData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }, []);

    const formatChartData = (oilData) => {

        if (!oilData || Object.keys(oilData).length === 0) {
            return {
                labels: [],
                datasets: [],
            };
        }
        const oilNames = {
            'B034': '고급휘발유',
            'B027': '보통휘발유',
            'D047': '자동차경유',
            'C004': '실내등유',
            // 'K015': '자동차부탄',
        };
        const excludedOilTypes = ['K015']; // 자동차부탄 제외
        const formatDate = (dateString) => {
            // const year = dateString.slice(0, 4);
            const month = dateString.slice(4, 6);
            const day = dateString.slice(6, 8);
            return `${month}/${day}`;
        };
        const labels = oilData['B027'].map(item => formatDate(item.date));

        const datasets = Object.keys(oilData)
            .filter(oilType => !excludedOilTypes.includes(oilType))
            .map((label,index) => {
                const data = oilData[label].map(item => item.price);
                return {
                    type: 'line',
                    label: oilNames[label],
                    borderColor: 'rgb(255,176,176)',
                    data: data,
                    fill: false,
                    hidden: index !== 0,

                };
            });

        return {
            labels: labels,
            datasets: datasets,
        };
    };
    const chartData = formatChartData(oilData);

    const legendTitle = {
        display: true,
        text: '7일간 유가 변동',
        padding: 20,
        font: {
            size: 16,
            weight: 'bold',
        }
    };


    const options = {

        plugins: {
            legend: {
                title: legendTitle,
            }
        },
        scales: {
            'y': {
                beginAtZero: false,
                display: true,
                position: 'left',
                min: Math.min(...chartData.datasets.map(dataset => dataset.minValue)),
                max: Math.max(...chartData.datasets.map(dataset => dataset.maxValue)+50),
                ticks: {
                    min: Math.min(...chartData.datasets.map(dataset => dataset.minValue)),
                    max: Math.max(...chartData.datasets.map(dataset => dataset.maxValue)) + 50,
                    stepSize: 1,
                    callback: function (value) {
                        return value + '원';
                    }
                }
            }
        }
    };

    return (

        <div style={{width: '100%', maxWidth: '400px', margin: 'auto'}}>

            <Bar data={chartData} id="myChart" options={options} width={400} height={460}/>
        </div>
    );
}

export default ChartLine;
