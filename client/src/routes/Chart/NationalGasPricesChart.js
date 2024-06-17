import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    Legend,
    Tooltip,
    BarController,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import styles from './Chart.css'
// 전역 폰트 설정
ChartJS.defaults.font.family = 'GmarketSans';
ChartJS.defaults.font.size = 14;
ChartJS.defaults.font.style = 'normal';

function App() {
    ChartJS.register(
        LinearScale,
        CategoryScale,
        BarElement,
        Legend,
        Tooltip,
        BarController
    );

    const [stations, setStations] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/api/avgAllPrice')
            .then(response => {
                setStations(response.data);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            })
    }, []);

    const labels = stations.map(station => station.name);
    const price = stations.map(station => station.price);

    const chartdata = {
        labels,
        datasets: [
            {
                type: 'bar',
                label: '실시간 전국 평균 유가',
                backgroundColor: 'rgb(174,178,217)',
                data: price.map(price => parseInt(price, 10)),
                borderColor: 'white',
                borderWidth: 2,
                yAxisID: 'y',
                barPercentage: 0.7
            }
        ]
    };

    const options = {
        plugins: {
            legend: {
                display: true,
                labels: {
                    font: {
                        size: 16,
                        weight: 'bold',
                    }
                }
            },
            tooltip: {
                bodyFont: {
                    size: 15,
                },
                callbacks: {
                    title: function () {
                        return ''; // 타이틀을 비우거나 비활성화
                    },
                    label: function (context) {
                        return `${context.label.split(" : ")[0]}: ${context.parsed.y}원`;
                        // return `${context.parsed.y}원`;
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        weight: 'bold',
                        size: 15,
                    }
                }
            },
            'y': {
                display: true,
                position: 'left',
                min: 900,
                max: 2000,
                ticks: {
                    stepSize: 20,
                    color: '#333',
                    font: {
                        size: 15,
                    }
                },
                grid: {
                    color: '#e5e5e5',
                    borderDash: [5, 5],
                    drawBorder: false,
                }
            }
        }
    };

    return(
    <div className={styles.Chart}>
        <Bar data={chartdata} options={options} width={600} height={460}/>
    </div>);

}

export default App;
