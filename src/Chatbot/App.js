import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [messages, setMessages] = useState([]);
    const [stations, setStations] = useState([]);
    const [darkMode, setDarkMode] = useState(true);
    const toggleTheme = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.body.classList.add('dark');
            document.body.classList.remove('light');
        } else {
            document.body.classList.add('light');
            document.body.classList.remove('dark');
        }
    };
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark');
            document.body.classList.remove('light');
        } else {
            document.body.classList.add('light');
            document.body.classList.remove('dark');
        }
    }, []); // 빈 배열을 넣어 컴포넌트 마운트 시 한 번만 실행

        useEffect(() => {
            const chatContainer = document.querySelector('.chat-container');
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, [messages]); // 메시지가 업데이트될 때마다 실행


        const getLocationAndFetchFuelPrices = (type) => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const {latitude, longitude} = position.coords;
                    const botResponse = {
                        id: Date.now(),
                        text: `${type === 'fuel' ? '주유소' : '전기차 충전소'} 정보를 조회 중입니다...`,
                        sender: 'bot'
                    };
                    setMessages(messages => [...messages, botResponse]);
                    try {
                        const pricesInfo = await fetchFuelPrices(latitude, longitude, type);
                        setMessages(messages => [...messages, {id: Date.now(), text: pricesInfo, sender: 'bot'}]);
                    } catch (error) {
                        setMessages(messages => [...messages, {
                            id: Date.now(),
                            text: '정보를 가져오는 데 실패했습니다.',
                            sender: 'bot'
                        }]);
                    }
                }, (error) => {
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
                });
            } else {
                const botResponse = {id: Date.now(), text: "Geolocation이 지원되지 않는 브라우저입니다.", sender: 'bot'};
                setMessages(messages => [...messages, botResponse]);
            }
        };

        const fetchFuelPrices = async (latitude, longitude, type) => {
            const response = await axios({
                method: 'post',
                url: 'http://localhost:5000/get_gas_stations',
                data: {
                    latitude: latitude,
                    longitude: longitude,
                    type: type
                },
                responseType: 'text'  // XML 응답을 기대할 때 설정 (axios가 'document'를 공식적으로 지원하지 않으므로 'text'로 설정)
            });

            // XML 응답을 파싱하기 위해 DOMParser 사용
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response.data, "application/xml");

            // XML에서 stations 요소를 추출
            const stations = Array.from(xmlDoc.getElementsByTagName("station")).map(node => ({
                id: node.getElementsByTagName("id")[0].textContent,
                name: node.getElementsByTagName("name")[0].textContent,
                price: node.getElementsByTagName("price")[0].textContent
            }));

            // stations 상태 업데이트
            setStations(stations);

            if (!stations.length) {
                throw new Error('데이터 형식이 올바르지 않습니다.');
            }

            return stations.map(station => `${station.name}의 가격은 ${station.price}원 입니다.`).join('\n');
        };

        const handleSend = (message) => {
            setMessages([...messages, {id: Date.now(), text: message, sender: 'user'}]);
            if (message === '내 주변 최저가 주유소 찾기') {
                getLocationAndFetchFuelPrices('fuel');
            } else if (message === '내 주변 전기차 충전소 찾기') {
                getLocationAndFetchFuelPrices('chargers');
            }
        };

        return (
            <div className={`App ${darkMode ? 'dark' : 'light'}`}>
                <header className="App-header">
                    <h1>채트보트</h1>
                    <button className="theme-toggle-button" onClick={toggleTheme}>{darkMode ? '라이트 모드' : '다크 모드'}</button> {/* 테마 토글 버튼 추가 */}
                </header>
                <div className="chat-container">
                    {messages.map(msg => (
                        <div key={msg.id} className={`message ${msg.sender}`}>
                            {msg.text}
                        </div>
                    ))}
                </div>
                <div className="stations-list">
                    <h2></h2>
                    <ul>
                        {stations.map(station => (
                            <li key={station.id}>
                                {station.name} - {station.price}원
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="input-area">
                    <button onClick={() => handleSend('내 주변 최저가 주유소 찾기')}>1. 내 주변 최저가 주유소 찾기</button>
                    <button onClick={() => handleSend('내 주변 전기차 충전소 찾기')}>2. 내 주변 전기차 충전소 찾기</button>
                </div>
            </div>
        );
}

export default App;
