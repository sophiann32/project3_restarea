import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
function NearbyGasChart() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/gas-stations')  // Flask 서버의 주소 입력
        .then(response => {
          console.log(response.data); // 데이터가 콘솔에 출력됩니다.
          setStations(response.data);
        })
        .catch(error => {
          console.error('Error fetching data: ', error);
        })
  }, []);

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
    const legendTitle = {
        display: true,
        text: '내 주변 주유소 가격비교',
        padding: 20, // 제목과 범례 사이의 간격 조절
        font: {
            size: 16, // 폰트 크기 설정
            weight: 'bold', // 폰트 굵기 설정
        }
    };

    const options = {
        plugins: {
            legend: {
                position: 'top',
                title: legendTitle // 범례 제목 적용
            },
        },

    };

    return (
        <div className="App">
            <div className="App">
                <div style={{width: '100%', maxWidth: '400px', margin: 'auto'}}>
                    <Doughnut data={chartData} options={options} width={400} height={460} />
                </div>
            </div>
        </div>
    );
}

export default NearbyGasChart;
