import React from 'react';
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


// function colorize(opaque) {
//     return (ctx) => {
//         const v = ctx.parsed.y;
//         const c = v < -50 ? '#5db648'
//
//             : v < 0 ? '#73dc84'
//                 : v < 50 ? '#f88c98'
//                     : '#f35050';
//
//         return opaque ? c : v;
//     };
// }
function ChartLineCombo({ stations }) {
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
    const combinedData = labels.map((label, index) => (`${label} : ${price[index] + '원'}`));
    const chartdata = {

        labels: combinedData,
        datasets: [


            {
                type: 'bar',
                label: '현 위치 주유소 가격',
                backgroundColor: 'rgb(174,178,217)',
                data: price.map((price) => parseInt(price)),
                borderColor: 'white',
                borderWidth: 2,
                yAxisID: 'y'

            },

            {
                type: 'bar',
                label: '40L 충전시 가격',
                data: price.map((price) => parseInt(price)*40),
                yAxisID: 'y1',
                elements: {
                    bar: {
                        backgroundColor: 'rgb(180,215,163)',
                        borderColor: 'white',
                        borderWidth: 2
                    }
                }
            }
        ],};
    const legendTitle = {
        display: true,
        text: '현 위치 유가정보,40L 충전시 가격',
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
            }
        },
            scales: {
                'y': {
                    display: true,
                    position: 'left',
                    min: 900, // 최소값 설정
                    max: 2500, // 최대값 설정
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
                    min: 36000, // 최소값 설정
                    max: 100000, // 최대값 설정
                    ticks: {
                        stepSize: 500,
                        callback: function (value) {
                            return value + '원';
                        },
                    }
                },
            }
    };

    return (<Bar data={chartdata} options={options} />);
}

export default ChartLineCombo;