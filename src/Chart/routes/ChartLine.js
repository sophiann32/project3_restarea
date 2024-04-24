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
function ChartLine({ stations }) {
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
    // const maxDataValue = 15; // 최대 데이터 값
    // let minDataValue = Math.min(mostNegativeValue, options.suggestedMin);
    // let maxDataValue = Math.max(mostPositiveValue, options.suggestedMax);

    const chartdata = {

        labels: combinedData,
        datasets: [
            // {
            //     type: 'line',
            //     label: 'Dataset 1',
            //     borderColor: 'rgb(255, 99, 132)',
            //     borderWidth: 2,
            //     fill: false,
            //     data: price.map((price) => parseInt(price)),
            // },

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

export default ChartLine;