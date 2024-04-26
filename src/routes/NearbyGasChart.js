import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App( ) {
    ChartJS.register(ArcElement, Tooltip, Legend);
    const [stations, setStations] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: '충전 가능 슬롯 수',
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1,
            }
        ],
    });

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/api/gas-stations')
            .then(response => {
                console.log(response.data);
                setStations(response.data);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            })
    }, []);
    const legendTitle = {
        display: true,
        text: '전기차 충전 가능 슬롯 수 ',
        padding: 20, // 제목과 범례 사이의 간격 조절
        font: {
            size: 16, // 폰트 크기 설정
            weight: 'bold', // 폰트 굵기 설정
        }
    };
    // 차트 옵션 설정
    const options = {
        // onClick : handleChartClick,
        plugins: {
            legend: {
                position: 'top',
                title: legendTitle, // 범례 제목 적용
                // onClick: handleLegendClick
            },
        },
    };



    useEffect(() => {
        let labels = [];
        if (stations.length > 0) {
            labels = stations.map((station) => station.name);
        }
        const EmptyParkingLot = labels.map(() => Math.floor(Math.random() * 3));
        const combinedData = labels.map((label) => (`${label}`));
        const backgroundColors = labels.map((_, index) => `hsl(${200 + index * 30}, 90%, ${85 - index * 3}%)`);
        setChartData({
            labels: combinedData,
            datasets: [
                {
                    ...chartData.datasets[0],
                    data: EmptyParkingLot,
                    backgroundColor: backgroundColors,
                }
            ],
        });
    }, [stations]);

    useEffect(() => {
        const interval = setInterval(() => {
            setChartData((prevChartData) => {
                const newData = prevChartData.datasets[0].data.map((value) => {
                    // 이전 데이터 값에 약간의 변화를 줌 (-2부터 2까지 랜덤한 값)
                    let newValue = value + Math.floor(Math.random() * 5) - 2; // -2, -1, 0, 1, 2 중에서 랜덤으로 선택
                    newValue = Math.min(Math.max(newValue, 0), 7); // 값이 0보다 작으면 0으로, 10보다 크면 10으로 설정
                    return newValue;
                });
                return {
                    ...prevChartData,
                    datasets: [
                        {
                            ...prevChartData.datasets[0],
                            data: newData,
                        }
                    ]
                };
            });
        }, 6000);

        return () => clearInterval(interval); // 컴포넌트가 소멸될 때 해당 인터벌을 정리
    }, []);

    return (
        <div className="App">
            <div style={{width: '40%', margin: 'auto'}}>
                <canvas id="salesChart"></canvas>
                <Doughnut data={chartData}  options={options}/>
            </div>
        </div>
    );
}

export default App;
