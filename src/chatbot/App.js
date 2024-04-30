import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [messages, setMessages] = useState([]);
    const [fuelStations, setFuelStations] = useState([]);
    const [chargingStations, setChargingStations] = useState([]);

    useEffect(() => {
        const chatContainer = document.querySelector('.chat-container');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, [messages]);

    const fetchChargingStations = async (latitude, longitude) => {
        try {
            const response = await axios.get('http://localhost:3003/api/chargingstations');
            console.log("첫 번째 충전소 데이터:", response.data[0]);  // 첫 번째 데이터 객체 확인을 위한 로깅

            const stations = response.data.map(station => ({
                ...station,
                distance: calculateDistance(
                    latitude,
                    longitude,
                    parseFloat(station.LAT),  // LAT 문자열을 숫자로 변환
                    parseFloat(station.LNG)   // LNG 문자열을 숫자로 변환
                )
            })).sort((a, b) => a.distance - b.distance).slice(0, 10); // 사용자 위치와의 거리 계산 후 가까운 순서로 정렬

            setChargingStations(stations);
        } catch (error) {
            setMessages(messages => [...messages, {
                id: Date.now(),
                text: '전기차 충전소 정보를 가져오는 데 실패했습니다.',
                sender: 'bot'
            }]);
        }
    };
// 거리 계산 함수
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // 지구 반지름(km)
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // 거리(km)
    };
    const handleGeolocationError = (error) => {
        let errorMessage = "위치 정보를 가져올 수 없습니다.";
        switch (error.code) {
            case error.PERMISSION_DENIED:
                errorMessage += " 사용자가 위치 서비스 사용을 거부했습니다.";
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage += " 위치 정보를 사용할 수 없습니다.";
                break;
            case error.TIMEOUT:
                errorMessage += " 위치 정보 요청이 시간 초과되었습니다.";
                break;
            default:
                errorMessage += " 에러: " + error.message;
                break;
        }
        const botResponse = {id: Date.now(), text: errorMessage, sender: 'bot'};
        setMessages(messages => [...messages, botResponse]);
    };

    const fetchFuelPrices = async (latitude, longitude, type) => {
        try {
            const response = await axios.post('http://localhost:5000/get_gas_stations', {
                latitude: latitude,
                longitude: longitude,
                type: type
            });
            console.log("클라이언트 측에서 받은 데이터:", response.data);

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response.data, "application/xml");

            const oilNodes = xmlDoc.getElementsByTagName("OIL");
            if (oilNodes.length === 0) {
                throw new Error("XML 데이터에서 유효한 주유소 정보를 찾을 수 없습니다.");
            }

            const stations = Array.from(oilNodes).map(node => ({
                id: node.getElementsByTagName("UNI_ID")[0].textContent,
                name: node.getElementsByTagName("OS_NM")[0].textContent,
                price: node.getElementsByTagName("PRICE")[0].textContent,
                distance: node.getElementsByTagName("DISTANCE")[0].textContent
            })).sort((a, b) => parseFloat(a.price) - parseFloat(b.price)).slice(0, 10);

            setFuelStations(stations);
        } catch (error) {
            console.error('Fuel stations fetch error:', error);
            setMessages(messages => [...messages, {
                id: Date.now(),
                text: '주유소 정보를 가져오는 데 실패했습니다.',
                sender: 'bot'
            }]);
        }
    };



    const formatDistance = (distance) => {
        const distanceInMeters = parseFloat(distance);
        if (distanceInMeters < 1000) {
            return `${Math.round(distanceInMeters)}m`;
        } else {
            return `${(distanceInMeters / 1000).toFixed(1)}km`;
        }
    };



    const handleSendFuel = (message) => {
        setMessages(messages => [...messages, {id: Date.now(), text: message, sender: 'user'}]);
        if (message === '내 주변 최저가 주유소 찾기') {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(position => {
                    const {latitude, longitude} = position.coords;
                    fetchFuelPrices(latitude, longitude, 'fuel');
                }, (error) => {
                    handleGeolocationError(error);
                });
            } else {
                const botResponse = {id: Date.now(), text: "Geolocation이 지원되지 않는 브라우저입니다.", sender: 'bot'};
                setMessages(messages => [...messages, botResponse]);
            }
        }
    };
    const handleSendCharging = (message) => {
        setMessages(messages => [...messages, {id: Date.now(), text: message, sender: 'user'}]);
        if (message === '내 주변 전기차 충전소 찾기') {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(position => {
                    const {latitude, longitude} = position.coords;
                    fetchChargingStations(latitude, longitude);
                }, (error) => {
                    handleGeolocationError(error);
                });
            } else {
                const botResponse = {id: Date.now(), text: "Geolocation이 지원되지 않는 브라우저입니다.", sender: 'bot'};
                setMessages(messages => [...messages, botResponse]);
            }
        }
    };

    return (
        <div className={"APP"}>
            <div className="chat-container">
                {messages.map(msg => (
                    <div key={msg.id} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="stations-list">
                <h2>주유소 정보:</h2>
                <ul>
                    {fuelStations.map(station => (
                        <li key={station.id}>
                            {station.name} - {station.price}원 - 현 위치로부터 {formatDistance(station.distance)} 떨어짐
                        </li>
                    ))}
                </ul>
            </div>
            <div className="stations-list">
                <h2>전기차 충전소 정보:</h2>
                <ul>
                    {chargingStations.map((station, index) => (
                        <li key={station.id || index}>
                            {station.name} - 현 위치로부터 {formatDistance(station.distance)} 떨어짐
                        </li>
                    ))}
                </ul>
            </div>

            <div className="input-area">
                <button onClick={() => handleSendFuel('내 주변 최저가 주유소 찾기')}>1. 내 주변 최저가 주유소 찾기</button>
                <button onClick={() => handleSendCharging('내 주변 전기차 충전소 찾기')}>2. 내 주변 전기차 충전소 찾기</button>
            </div>
        </div>
    );
}

export default App;
