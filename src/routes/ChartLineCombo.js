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
// import faker from 'Faker';

function colorize(opaque) {
    return (ctx) => {
        const v = ctx.parsed.y;
        const c = v < -50 ? '#5db648'

            : v < 0 ? '#73dc84'
                : v < 50 ? '#f55563'
                    : '#bb2e2e';

        return opaque ? c : v;
    };
}
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
    const combinedData = labels.map((label, index) => (`${label} : ${price[index]}`));
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
        ],};
        const options= {
            scales: {
                'y': {
                    display: true,
                    position: 'left',
                    min: 1700, // 최소값 설정
                    max: 1800, // 최대값 설정
                    ticks: {
                        stepSize: 10} // 간격 설정
                },
                'y1': {
                    display: true,
                    position: 'right',
                    suggestedMin: -20, // 오른쪽 y 축의 최소값
                    suggestedMax: 20, // 오른쪽 y 축의 최대값
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function (value, index, ticks) {
                            return value + '원';
                        }
                    }

                },
            }

    };
    return (<Bar data={chartdata} options={options} />);
}



export default ChartLineCombo;