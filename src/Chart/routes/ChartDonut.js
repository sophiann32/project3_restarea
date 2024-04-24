import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useState, useEffect } from 'react';

function ChartDonut({ stations }) {
    ChartJS.register(ArcElement, Tooltip, Legend);
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

    const handleLegendClick = (event, legendItem, legend) => {
        console.log('Legend Clicked:', legendItem);
    };
     const handleChartClick = (event, elements) => {
         if (elements.length) {
             const firstElement = elements[0];
             console.log('Element Clicked:', firstElement);
         }
     };
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
        onClick : handleChartClick,
        plugins: {
            legend: {
                position: 'top',
                title: legendTitle, // 범례 제목 적용
                onClick: handleLegendClick
            },
        },
    };
       useEffect(() => {
        let labels = [];
        if (stations.length > 0) {
            labels = stations.map((station) => station.name);
        }
        const EmptyParkingLot = labels.map(() => Math.floor(Math.random() * 10));
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
                const newData = prevChartData.datasets[0].data.map(value => value + Math.floor(Math.random() * 1.1));
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
        }, 1000);

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

export default ChartDonut;
