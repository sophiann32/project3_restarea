import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// import './chat.module.css';
import styles from './chat.module.css';
import { FaMicrophone } from 'react-icons/fa';
import { Link,useNavigate } from 'react-router-dom';
import Stationinfo from './Stationinfo';
import AudioSwitch from './../routes/Media/AudioSwitch';
function Chatbot({onClose}) {
    const [messages, setMessages] = useState([]);
    const [fuelStations] = useState([]);
    const [chargingStations] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const navigate = useNavigate();
    //---------------------------------------------------------------------
    const [question, setQuestion] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [dots, setDots] = useState('');
    const audioRef = useRef(null);
    useEffect(() => {
        if (isFetching) {
            const interval = setInterval(() => {
                setDots((prevDots) => {
                    if (prevDots.length < 3) {
                        return prevDots + '.';
                    } else {
                        return '.';
                    }
                });
            }, 500); // 500ms마다 dots 업데이트

            return () => clearInterval(interval); // 언마운트 시 interval 정리
        } else {
            setDots(''); // isFetching이 false일 때 dots 초기화
        }
    }, [isFetching]);

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
            text: '안녕하세요! Stop Scan입니다.\n' +
                '주유소와 충전소의 실시간 정보를 확인해 보세요.\n' +
                '휴게소 정보를 한눈에!\n' +
                '제주도의 관광명소와 전기충전소 상태를 실시간으로 확인하세요.\n' +
                '회원제 주유소 게시판도 이용해 보세요.',
            spokenText: '안녕하세요.',
            sender: 'bot'
        };
        setMessages([initialMessage]);
        speak(initialMessage.spokenText);

        const chatContainer = document.querySelector(`.${styles.chat_container}`);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, []);


    useEffect(() => {
        const chatContainer = document.querySelector(`.${styles.chat_container}`);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, [messages]);

    const speak = (text) => {
        const synth = window.speechSynthesis;
        const truncatedText = text.length > 120 ? text.substring(0, 120) + '  다음 내용은 기재되어있는 내용 참고하세요.' : text;
        const sanitizedText = truncatedText.replace(/[#/*///-]/g, '');
        const utterance = new SpeechSynthesisUtterance(sanitizedText);
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
            handleCommand(speechResult);
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
            })).slice(0, 10);
            //
            const formattedStations = stations.map((station, index) => `${index + 1}. ${station.name} ${station.price}원 현 위치로부터 ${formatFuelStationDistance(station.distance)} 떨어짐`).join('\n');
            const resultsMessage = {
                id: Date.now(),
                text: `5km 내 주유소 가격:\n${formattedStations}`,
                sender: 'bot'
            };

            const firstStation = stations[0];
            const speechText = `${firstStation.name} ${firstStation.price}원 현 위치로부터 ${formatFuelStationDistance(firstStation.distance)} 떨어짐`;

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
        if (message.trim() === '주유소') {
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
        } else if( message.trim() ==='전기차') {
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
        if (message.trim() ==='휴게소') {
            navigate('/restArea'); // 지정된 경로로 이동
        }
        if( message.trim() ==='제주도') {
            navigate('/jeju');
        }
        if (message.trim() ==='유가') {
            navigate('/sub');
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
            console.log('isFetching is true, starting interval');
            const interval = setInterval(() => {
                setDots(dots => dots.length < 10 ? dots + '.' : '');
            }, 500);
            if (audioRef.current) {
                audioRef.current.play();
            }
            return () =>{
                console.log('Clearing interval');
                clearInterval(interval);
            }
        }
    }, [isFetching]); // isFetching 상태값 변경되면 수행이 된다.

    const handleInputChange = (event) => {
        setQuestion(event.target.value);
    };
    const handleSubmit = async (message) => {
        if (typeof message !== 'undefined' && message.trim()) {
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

        if (message.trim() ==='주유소') {
            handleMessage('주유소', 'user');
        } else if (message.trim() ==='전기차') {
            handleMessage('전기차', 'user');
        } else if (message.trim() ==='휴게소') {
            handleMessage('휴게소', 'user');
        } else if (message.trim() ==='유가') {
            handleMessage('유가', 'user');
        } else if (message.trim() ==='제주도') {
            handleMessage('제주도', 'user');
        } else {

            handleSubmit(message);
        }
    };
    const stopSpeechSynthesis = () => {
        const synth = window.speechSynthesis;
        synth.cancel();
    };

    const handleLinkClick = () => {
        stopSpeechSynthesis();
    };

    //---------------------------------------------------------------------

    return (
        <div className={styles.chat_app}>
            <span className={styles.close_button} onClick={onClose}>&times;</span>
            <div className={styles.chat_container}>
                {messages.map(msg => (
                    <div key={msg.id} className={`${styles.message} ${styles[msg.sender]}`}
                         style={{whiteSpace: 'pre-line'}}>
                        {msg.url ? (
                            <Link to={msg.url} onClick={handleLinkClick}>{msg.text}</Link>
                        ) : (
                            msg.text
                        )}
                    </div>
                ))}
                {isFetching && messages.length > 0 ? (
                    <div className={styles.message}>
                        응답중{dots.split('').map((dot, i) => (
                        <span key={i}>{dot}</span>
                    ))}
                        <AudioSwitch ref={audioRef} src="/ElevenLabs_Sara_조금만.mp3"/>
                    </div>

                ) : (
                    !isFetching && messages.length === 0 && <div className={styles.message}/>
                )}


            </div>
            <div className={styles.stations_list}>
                <Chat stations={fuelStations} type="fuel"/>
            </div>
            <div className={styles.stations_list}>
                <Chat stations={chargingStations} type="charge"/>
            </div>

            <div className={styles.user_input}>

                <button onClick={() => handleMessage('주유소')}>내 주변 주유소의 최신 가격</button>
                <button onClick={() => handleMessage('전기차')}>내 주변 전기차 충전소</button>
                <container>
                    {/*<button id={"item1"} onClick={() => handleMessage('휴게소')}>휴게소로 이동</button>*/}
                    {/*<button id={"item2"} onClick={() => handleMessage('제주도')}>제주도으로 이동</button>*/}
                    {/*<button id={"item3"} onClick={() => handleMessage('유가')}>유가로 이동</button>*/}
                </container>
                {/*------------------------------------------------*/}
                <div id="bot-input-area">
                    <form className="test" onSubmit={(e) => {
                        e.preventDefault();
                        handleCommand(question);
                    }}>
                        <textarea className={"content"}
                                  value={question}
                                  onChange={handleInputChange}
                                  placeholder="알고 싶은 내용을 입력하세요."
                                  rows="4"
                                  cols="50"
                        />
                        <br/>
                        <button type="submit">보내기
                        </button>
                    </form>
                </div>

                <div className={styles.tooltip}>
                    <button className={styles.voice_button} onClick={handleSpeech} disabled={isListening}>
                        <FaMicrophone/>
                        {isListening ? "듣는 중..." : "음성인식"}

                    </button>
                    <span className={styles.tooltiptext}>
                        <span style={{fontSize: "18px", color: "greenyellow"}}>주유소 or 전기차</span> (가까운 곳 안내)<br/><span
                        style={{fontSize: "18px", color: "greenyellow"}}>휴게소 or 유가 or 제주도</span> (해당 페이지로 이동)<br/>자세한 내용도 물어보세요.<br/>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Chatbot;
