import React, { useState, useEffect } from 'react';
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
import axios from 'axios';


function colorize(opaque) {
    return (ctx) => {
        const v = ctx.parsed.y;
        const c = v < -50 ? '#5db648'
            : v < 0 ? '#73dc84'
                : v < 50 ? '#f88c98'
                    : '#f35050';

        return opaque ? c : v;
    };
}
function App() {

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

    const [stations, setStations] = useState([]);
    const [labels, setLabels] = useState([]);
    const [price, setPrice] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/api/avgAllPrice')
            .then(response => {
                console.log(response.data);
                setStations(response.data);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            })
    }, []);

    useEffect(() => {
        if (stations.length > 0) {
            const stationLabels = stations.map(station => station.name);
            setLabels(stationLabels);

            const stationPrices = stations.map(station => station.price);
            setPrice(stationPrices);
        }
    }, [stations]);


    // console.log(price)
    const combinedData = labels.map((label, index) => (`${label} : ${price[index] + '원'}`));
    const chartdata = {

        labels: combinedData,
        datasets: [

            {
                type: 'bar',
                label: '평균 가격',
                backgroundColor: 'rgb(174,178,217)',
                data: price.map((price) => parseInt(price)),
                borderColor: 'white',
                borderWidth: 2,
                yAxisID: 'y'

            },

            {
                type: 'bar',
                label: '전날 유가 차이',
                data: [3, 6, -5],
                yAxisID: 'y1',
                elements: {
                    bar: {
                        backgroundColor: colorize(false),
                        borderColor: colorize(true),
                        borderWidth: 2
                    }
                }
            }
        ]
    };
    const legendTitle = {
        display: true,
        text: '전국 평균 유가,전날 가격 차이',
        padding: 20, // 제목과 범례 사이의 간격 조절
        font: {
            size: 16, // 폰트 크기 설정
            weight: 'bold', // 폰트 굵기 설정
        }
    };


    const options= {
            plugins: {
                legend: {
                    title: legendTitle, // 범례 제목 적용
                    // onClick: (event, legendItem, legend) => {
                    //     // 클릭 이벤트 핸들링
                    //     console.log('Legend Clicked:', legendItem);
                    // }
                }
            },
            scales: {
                'y': {
                    display: true,
                    position: 'left',
                    min: 700, // 최소값 설정
                    max: 2300, // 최대값 설정
                    ticks: {
                        stepSize: 10,
                        callback: function (value){
                            return value+'원';
                        }
                    } // 간격 설정
                },
                'y1': {
                    display: true,
                    position: 'right',
                    suggestedMin: -30, // 오른쪽 y 축의 최소값
                    suggestedMax: 30, // 오른쪽 y 축의 최대값
                    ticks: {
                        stepSize: 2,
                        // Include a dollar sign in the ticks
                        callback: function (value) {
                            return value + '원';
                        },
                    }
                },
            }
        };

    return (<Bar data={chartdata} options={options} />);
}

export default App;