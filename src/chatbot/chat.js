import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './chat.css';
import { FaMicrophone } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Stationinfo from './Stationinfo';

function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [fuelStations] = useState([]);
    const [chargingStations] = useState([]);
    const [isListening, setIsListening] = useState(false);
    //---------------------------------------------------------------------
    const [question, setQuestion] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [dots, setDots] = useState('');
    // const [chatHistory, setChatHistory] = useState('');
    //---------------------------------------------------------------------
    const Chat = ({ stations }) => {
        return (
            <div>
                {stations.map(station => (
                    <Stationinfo
                        key={station.id}
                        name={station.name}
                        address={station.address}
                        distance={station.distance}
                    />
                ))}
            </div>

        );
    };
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const initialMessage = {
            id: Date.now(),
            text: '안녕하세요! Stop Scan입니다. 주유소,휴게소,제주여행,유가 관련 정보를 제공합니다.',
            spokenText: '안녕하세요.',
            sender: 'bot'
        };
        setMessages([initialMessage]);
        speak(initialMessage.spokenText);

        const chatContainer = document.querySelector('.chat-container');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, []);


    useEffect(() => {
        const chatContainer = document.querySelector('.chat-container');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, [messages]);

    const speak = (text) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        synth.speak(utterance);
    };

    const handleSpeech = () => {
        if (isListening) return;
        setIsListening(true);
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'ko-KR';
        recognition.start();

        recognition.onresult = (event) => {
            const speechResult = event.results[0][0].transcript;
            console.log(`Recognized: ${speechResult}`);
            // handleMessage(speechResult);
            // handleSubmit(speechResult);
            handleCommand(speechResult);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };
    };

    const fetchChargingStations = async (latitude, longitude) => {
        try {
            const response = await axios.post('http://localhost:5000/location', {
                latitude: latitude,
                longitude: longitude
            });
            const formattedStations = response.data.stations.map(station => `${station['Station Name']}  현 위치로부터 ${formatChargingStationDistance(station.Distance)} 떨어짐`).join('\n');
            const resultsMessage = {
                id: Date.now(),
                text: `전기차 충전소 정보:\n${formattedStations}`,
                sender: 'bot'
            };
            setMessages(messages => [...messages, resultsMessage]);
            speak(resultsMessage.text);
        } catch (error) {
            console.error("Error fetching stations:", error);
        }
    };

    const fetchFuelPrices = async (latitude, longitude, type) => {
        try {
            const response = await axios({
                method: 'post',
                url: 'http://localhost:5000/get_gas_stations22',
                data: { latitude, longitude, type }
            });

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response.data.data, "application/xml");
            const oilNodes = xmlDoc.getElementsByTagName("OIL");

            const stations = Array.from(oilNodes).map(node => ({
                id: node.getElementsByTagName("UNI_ID")[0].textContent,
                name: node.getElementsByTagName("OS_NM")[0].textContent,
                price: node.getElementsByTagName("PRICE")[0].textContent,
                distance: node.getElementsByTagName("DISTANCE")[0].textContent
            })).sort((a, b) => parseFloat(a.price) - parseFloat(b.price)).slice(0, 10);
            //
            const formattedStations = stations.map((station, index) => `${index + 1}. ${station.name} ${station.price}원 현 위치로부터 ${formatFuelStationDistance(station.distance)} 떨어짐`).join('\n');
            const resultsMessage = {
                id: Date.now(),
                text: `주유소 정보:\n${formattedStations}`,
                sender: 'bot'
            };

            const firstStation = stations[0];
            const speechText = `5킬로미터 내에 있는 최저가 주유소: ${firstStation.name} ${firstStation.price}원 현 위치로부터 ${formatFuelStationDistance(firstStation.distance)} 떨어짐`;

            setMessages(messages => [...messages, resultsMessage]);
            speak(speechText);

        } catch (error) {
            console.error("Error fetching stations:", error);
        }
    };

    const formatFuelStationDistance = (distance) => {
        const distanceInMeters = parseFloat(distance);
        return `${(distanceInMeters / 1000).toFixed(2)}km`;
    };

    const formatChargingStationDistance = (distance) => {
        const distanceInMeters = parseFloat(distance);
        return `${distanceInMeters.toFixed(2)}km`;
    };

    const handleMessage = (message, sender = 'user') => {
        const newMessage = { id: Date.now(), text: message, sender: sender };
        setMessages(messages => [...messages, newMessage]);
        speak(message);
        if (message.includes('주유소')) {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(position => {
                    const { latitude, longitude } = position.coords;
                    fetchFuelPrices(latitude, longitude, 'fuel');
                }, handleGeolocationError);
            } else {
                const botResponse = { id: Date.now(), text: "Geolocation이 지원되지 않는 브라우저입니다.", sender: 'bot' };
                setMessages(messages => [...messages, botResponse]);
                speak(botResponse.text);
            }
        } else if (message.includes('전기차')) {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(position => {
                    const { latitude, longitude } = position.coords;
                    fetchChargingStations(latitude, longitude);
                }, handleGeolocationError);
            } else {
                const botResponse = { id: Date.now(), text: "Geolocation이 지원되지 않는 브라우저입니다.", sender: 'bot' };
                setMessages(messages => [...messages, botResponse]);
                speak(botResponse.text);
            }
        }
        if (message.includes('휴게소')) {
            const RestareaUrl = "http://localhost:3000/restArea";
            const botResponse = {
                id: Date.now(),
                text: `고속도로 휴게소 정보를 확인하러 가려면 여기를 클릭하세요.`,
                sender: 'bot',
                url: RestareaUrl // URL을 메시지 객체에 추가
            };
            setMessages(messages => [...messages, botResponse]);
            speak("");
        }
        if (message.includes('로그인')) {
            const loginUrl = "http://localhost:3000/login";
            const botResponse = {
                id: Date.now(),
                text: `로그인 페이지로 이동하려면 여기를 클릭하세요.`,
                sender: 'bot',
                url: loginUrl
            };
            setMessages(messages => [...messages, botResponse]);
            speak("");
        }
        if (message.includes('유가')) {
            const statsUrl = "http://localhost:3000/sub";
            const botResponse = {
                id: Date.now(),
                text: `유가 통계 페이지로 이동하려면 여기를 클릭하세요.`,
                sender: 'bot',
                url: statsUrl
            };
            setMessages(messages => [...messages, botResponse]);
            speak("");
        }
    };

    const handleGeolocationError = (error) => {
        let errorMessage = '';
        switch (error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = "위치 정보 접근이 거부되었습니다.";
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = "위치 정보를 사용할 수 없습니다.";
                break;
            case error.TIMEOUT:
                errorMessage = "위치 정보를 가져오는 요청이 시간 초과되었습니다.";
                break;
            default:
                errorMessage = "알 수 없는 오류가 발생했습니다.";
                break;
        }
        const botResponse = {
            id: Date.now(),
            text: errorMessage,
            sender: 'bot'
        };
        setMessages(messages => [...messages, botResponse]);
        speak(botResponse.text);
    };

    //---------------------------------------------------------------------

    useEffect(() => {
        if (isFetching) {
            const interval = setInterval(() => {
                setDots(dots => dots.length < 10 ? dots + '.' : '');
            }, 500);
            return () =>{
                clearInterval(interval);
            }
        }
    }, [isFetching]); // isFetching 상태값 변경되면 수행이 된다.

    const handleInputChange = (event) => {
        setQuestion(event.target.value);
    };
    const handleSubmit = async (message) => {
        if (typeof message !== 'undefined' && message.trim()) {
            // setChatHistory(prev => `${prev}\n상담자: ${message}`);
            setIsFetching(true);
            const newMessage = { id: Date.now(), text: message, sender: 'user' };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            try {
                const response = await axios.post('http://localhost:5000/ere', { content: message });

                if (response.data.status === 'success') {
                    handleMessage(response.data.answer, 'bot');
                } else {
                    alert('Error: ' + response.data.message);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            } finally {
                setIsFetching(false);
            }
            setQuestion('');
        }
    };
    const handleCommand = (message) => {
        if (message.includes('주유소')) {
            handleMessage('주유소', 'user');
        } else if (message.includes('전기차')) {
            handleMessage('전기차', 'user');
        } else if (message.includes('휴게소')) {
            handleMessage('휴게소', 'user');
        } else if (message.includes('유가')) {
            handleMessage('유가', 'user');
        } else if (message.includes('로그인')) {
            handleMessage('로그인', 'user');
        } else {
            handleSubmit(message);
        }
    };

    //---------------------------------------------------------------------

    return (
        <div className="chat_app">
            <div className="chat-container">
                {messages.map(msg => (
                    <div key={msg.id} className={`message ${msg.sender}`}>
                        {msg.url ? (
                            <Link to={msg.url}>{msg.text}</Link>
                        ) : (
                            msg.text
                        )}
                    </div>
                ))}
                {isFetching && messages.length > 0 ? (
                    <div className="message user">
                        응답중{[...Array(dots)].map((_, i) => (
                        <span key={i}>.</span>
                    ))}
                    </div>
                ) : (
                    <div className="message user" />
                )}


            </div>
            <div className="stations-list">
                <Chat stations={fuelStations} type="fuel" />
            </div>
            <div className="stations-list">
                <Chat stations={chargingStations} type="charge" />
            </div>

            <div className="user-input">
                <button onClick={() => handleMessage('내 주변 최저가 주유소 찾기')}>내 주변 최저가 주유소 찾기</button>
                <button onClick={() => handleMessage('내 주변 전기차 충전소 찾기')}>내 주변 전기차 충전소 찾기</button>
                <container id={"con1"}>
                    {/*<button id={"item1"} onClick={() => handleMessage('휴게소')}>휴게소로 이동</button>*/}
                    {/*<button id={"item2"} onClick={() => handleMessage('로그인')}>로그인으로 이동</button>*/}
                    {/*<button id={"item3"} onClick={() => handleMessage('유가')}>유가로 이동</button>*/}
                </container>
                {/*------------------------------------------------*/}
                <div id="bot-input-area">
                    <form className="test" onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(question);
                    }}>
                        <textarea className={"content"}
                                  value={question}
                                  onChange={handleInputChange}
                                  placeholder="알고 싶은 내용을 입력하세요."
                                  rows="4"
                                  cols="50"
                        />
                        <br />
                        <button type="submit">보내기</button>
                    </form>
                </div>

                {/*-----------------------------------------------------*/}
                <div className="tooltip">
                    <button className="voice-button" onClick={handleSpeech} disabled={isListening}>
                        <FaMicrophone />
                        {isListening ? "듣는 중..." : "음성인식"}
                    </button>
                    <span className="tooltiptext">
                        주유소! 전기차! 휴게소! 유가! 로그인!<br /> 정보 제공 및 홈페이지 이동 <br /> 그외 자세한 정보도 알려드립니다.<br />
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Chatbot;
