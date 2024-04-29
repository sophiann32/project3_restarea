import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

const LocationTracker = () => {
    const [stations, setStations] = useState([]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            axios.post('http://localhost:5000/location', { latitude, longitude })
                .then(response => {
                    setStations(response.data.stations); // 충전소 정보 상태 업데이트
                })
                .catch(error => {
                    console.error('에러 :', error);
                });
        }, error => {
            console.error(error.message);
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    }, []);

    return (
        <ChartDonut stations={stations.map(station => station["Station Name"])} />
    );
};

function ChartDonut(props) {
    const { stations } = props;

    ChartJS.register(ArcElement, Tooltip, Legend);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: '충전 가능 슬롯 수',
                data: [],
                backgroundColor: [],
                borderWidth: 1,
                borderColor: []
            }
        ],
    });

    useEffect(() => {
        let labels = stations;
        const EmptyParkingLot = labels.map(() => Math.floor(Math.random() * 3));
        const backgroundColors = labels.map((_, index) => `hsl(${200 + index * 30}, 90%, ${90 - index * 5}%)`);
        const borderColors = labels.map((_, index) => `hsl(${200 + index * 30}, 100%, ${80 - index * 5}%)`); // 채도와 밝기를 조금 조정


        setChartData({
            labels: labels,
            datasets: [
                {
                    data: EmptyParkingLot,
                    backgroundColor: backgroundColors,
                    borderColor:borderColors,
                }
            ],
        });
    }, [stations]);
    const handleChartClick = (event, elements) => {
        if (!elements || elements.length === 0) {
            return; // elements가 undefined이거나 길이가 0이면 함수 종료
        }
        if (elements.length > 0) {
            // const clickedElementIndex = elements[0].index;
            // const clickedData = chartData.labels[clickedElementIndex];
            // 클릭한 슬라이스의 데이터를 활용하여 다른 창으로 이동하는 로직 작성
            // 예: 새로운 창 열기 또는 특정 URL로 이동
            // window.open(`/map/${clickedData}`, '_blank');
            window.open('http://localhost:3000/map', '_blank');
        }
    };
    const legendTitle = {
        display: true,
        text: '내 주변 전기차 충전 가능 한 곳',
        padding: 20, // 제목과 범례 사이의 간격 조절
        font: {
            size: 16, // 폰트 크기 설정
            weight: 'bold', // 폰트 굵기 설정
        }
    };

    const options = {
        plugins: {
            tooltip: {
                enabled: true,
                bodyFont: {
                    size: 15,
                },
                callbacks: {
                    beforeBody: function() {
                        return '빈 슬롯 수'; // 툴팁 본문 전에 표시될 텍스트
                    }
                }
            },
            legend: {
                position: 'top',
                title: legendTitle // 범례 제목 적용
            },
        },
        onClick: handleChartClick,
    };
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
        }, 10000);

        return () => clearInterval(interval); // 컴포넌트가 소멸될 때 해당 인터벌을 정리
    }, []);
    return (
        <div className="App">
            <div style={{width: '100%', maxWidth: '400px', margin: 'auto'}}>
                <Doughnut data={chartData} options={options} width={400} height={460} />
            </div>
        </div>
    );
}
export default LocationTracker;
