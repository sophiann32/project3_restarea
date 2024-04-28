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
    const [diffs, setDiffs] = useState([]);


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
            const stationDiffs = stations.map(station => station.diff);
            setDiffs(stationDiffs);
        }
    }, [stations]);
    // function colorize(opaque) {
    //     return (ctx) => {
    //         console.log(ctx); // ctx 객체 전체를 로그로 출력
    //         const v = ctx.parsed.y;
    //         console.log(v); // ctx.parsed.y 값 로깅
    //
    //         const c = v < -50 ? '#5db648'
    //             : v < 0 ? '#73dc84'
    //                 : v < 50 ? '#f88c98'
    //                     : '#f35050';
    //
    //         return opaque ? c : v;
    //     };
    // }

    // console.log(price)
    const combinedData = labels.map((label, index) => (`${label} :  ${parseInt(price[index])}원`));
    const chartdata = {

        labels: combinedData,
        datasets: [

            {
                type: 'bar',
                label: '',
                backgroundColor: 'rgb(174,178,217)',
                data: price.map((price) => parseInt(price)),
                borderColor: 'white',
                borderWidth: 2,
                yAxisID: 'y'

            },

            // {
            //     type: 'bar',
            //     label: '전날 유가 차이',
            //     data: diffs.map((diff) => parseInt(diff)),
            //     yAxisID: 'y1',
            //     elements: {
            //         bar: {
            //             backgroundColor: colorize(false),
            //             borderColor: colorize(true),
            //             borderWidth: 2
            //         }
            //     }
            // }
        ]
    };
    const legendTitle = {
        display: true,
        text: '실시간 전국 평균 유가',
        padding: 20, // 제목과 범례 사이의 간격 조절
        font: {
            size: 16, // 폰트 크기 설정
            weight: 'bold', // 폰트 굵기 설정
        }
    };


    const options = {
        plugins: {
            legend: {
                title: legendTitle, // 범례 제목 적용
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
                    color: '#333', // 눈금 색상 변경
                    font: {
                        size: 12, // 눈금 글꼴 크기 변경
                    },
                    callback: function (value) {
                        return value + '원';
                    }
                },
                grid: {
                    color: '#e5e5e5', // 그리드 라인 색상 변경
                    borderDash: [5, 5], // 그리드 라인 대시 스타일 설정
                    drawBorder: false, // 차트 외곽선 그리기 비활성화
                }
            }
        //     'y1': {
        //         display: true,
        //         position: 'right',
        //         suggestedMin: -20, // 오른쪽 y 축의 최소값
        //         suggestedMax: 20, // 오른쪽 y 축의 최대값
        //         ticks: {
        //             stepSize: 2,
        //             color: '#333', // 눈금 색상 변경
        //             font: {
        //                 size: 12, // 눈금 글꼴 크기 변경
        //             },
        //             callback: function (value) {
        //                 return value + '원';
        //             },
        //         },
        //         grid: {
        //             display: false, // 오른쪽 y 축의 그리드 라인 비활성화
        //         }
        //     },
        }
    };


    return (<Bar data={chartdata} options={options} />);
}

export default App;