import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {useNavigate} from "react-router-dom";
import styles from './Chart.css'
function NearbyGasChart({ data }) {
    const [stations, setStations] = useState([]);

    useEffect(() => {
        if (data) {
            setStations(data);
        }
    }, [data]);

    ChartJS.register(ArcElement, Tooltip, Legend);

    let labels = [];

    if (stations.length > 0) {
        labels = stations.map((station, index) => {
            return `${index + 1}순위 - ${station.name}`;
        });
    }
    // console.log(labels)
    let price = [];
    if (stations.length > 0) {
        price = stations.map((station) => `${station.price}원`);
    }


    // console.log(price)
    const combinedData = labels.map((label, index) => (`${label} : ${price[index]}`));

    const chartData = {

        labels: combinedData,
        datasets: [
            {
                // label: '가격',
                data: price.map((price) => parseInt(price)), // 가격 데이터를 사용하여 데이터 생성
                backgroundColor: labels.map((_, index) => `hsl(${60 + index * 10}, 80%, ${65 - index * 3}%)`),
                borderColor: Array.from({ length: labels.length }, () => 'green'),
                borderWidth: 1,
            }
        ]
    };
    const legendTitle = {
        display: true,
        text: '내 주변 주유소 휘발유 가격비교',
        padding: 20, // 제목과 범례 사이의 간격 조절
        font: {
            size: 16, // 폰트 크기 설정
            weight: 'bold', // 폰트 굵기 설정
        }
    };
    const navigate = useNavigate();
    const handleChartClick = (event, elements) => {
        if (!elements || elements.length === 0) {
            return;
        }
        if (elements.length > 0) {
            // const clickedElementIndex = elements[0]._index;
            // const clickedData = chartData.labels[clickedElementIndex];
            navigate(`/map`);
        }
    };
    const options = {
        plugins: {
            tooltip: {
                bodyFont: {
                    size: 15,
                },
                callbacks: {
                    title: function () {
                        return '';
                    },
                    label: function (context) {
                        return `${context.label.split(" : ")[0]}: ${context.label.split(" : ")[1]}`;
                        // return `${context.parsed.y}원`;

                    }
                }
            },
            legend: {
                position: 'top',
                title: legendTitle,
                labels:
                    {
                        boxHeight: 17.5,
                        maxHeight: 105,
                        // filter: (legendItem, data) => {
                        //     return data.datasets.length > 5 ? data.datasets.indexOf(legendItem.dataset) < 5 : true;
                        // }

                    }

            },
        },

        onClick: handleChartClick,
    };

    return (
            <div className={styles.Chart}>
                <div style={{width: '100%', maxWidth: '400px', margin: 'auto'}}>
                    <Doughnut data={chartData} options={options} width={400} height={460} />
                </div>
            </div>
    );
}

export default NearbyGasChart;
