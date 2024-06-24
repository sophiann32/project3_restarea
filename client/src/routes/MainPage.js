import React, { useState, useEffect, useRef,useCallback } from 'react';
import styles from './main_page.module.css';
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';
import ChatBot from '../chatbot/chat';
import NearbyGasChart from '../routes/Chart/NearbyGasChart.js';
import NationalGasPricesChart from '../routes/Chart/NationalGasPricesChart';
import Chart7 from '../routes/Chart/Chart7';
import axios from 'axios';
import { lazy, Suspense } from 'react';


// 텍스트 애니메이션 컴포넌트
const AnimatedPlaceholder = ({ text }) => {
    const [placeholder, setPlaceholder] = useState('');
    const [index, setIndex] = useState(0);

    const animatePlaceholder = useCallback(() => {
        if (index < text.length) {
            setPlaceholder(prev => prev + text[index]);
            setIndex(index + 1);
            requestAnimationFrame(animatePlaceholder);
        }
    }, [text, index]);

    useEffect(() => {
        requestAnimationFrame(animatePlaceholder);
    }, [animatePlaceholder]);

    return placeholder;
};

function MainPage() {
    const [selectedRoute, setSelectedRoute] = useState('');
    const [previousRoute, setPreviousRoute] = useState('');
    const [gasStations, setGasStations] = useState(null); // 주유소 데이터를 위한 상태
    const navigate = useNavigate();
    const [isModalOpen, setModalOpen] = useState(false);
    const [placeholderText, setPlaceholderText] = useState('');
    const [isPlaceholderVisible, setPlaceholderVisible] = useState(true);
    const intervalRef = useRef(null);
    const blinkIntervalRef = useRef(null);
    const fullPlaceholderText = "원하는 도로의 휴게소 정보를 확인하세요...";

    const currentIndexRef = useRef(0);
    const animationFrameRef = useRef(null);

    const animatePlaceholder = useCallback(() => {
        if (currentIndexRef.current < fullPlaceholderText.length) {
            setPlaceholderText(fullPlaceholderText.slice(0, currentIndexRef.current + 1));
            currentIndexRef.current++;
            animationFrameRef.current = requestAnimationFrame(animatePlaceholder);
        } else {
            // 애니메이션 완료 후 처리
            setInterval(() => {
                setPlaceholderVisible(prev => !prev);
            }, 500);
        }
    }, [fullPlaceholderText]);

    useEffect(() => {
        animationFrameRef.current = requestAnimationFrame(animatePlaceholder);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [animatePlaceholder]);



    //
    // useEffect(() => {
    //     let currentIndex = 0;
    //
    //     const addChar = () => {
    //         if (currentIndex < fullPlaceholderText.length && currentIndex < 24) {
    //             setPlaceholderText((prev) => prev + fullPlaceholderText[currentIndex]);
    //             currentIndex++;
    //         } else {
    //             clearInterval(intervalRef.current);
    //             blinkIntervalRef.current = setInterval(() => {
    //                 setPlaceholderVisible(prev => !prev);
    //             }, 500);
    //         }
    //     };
    //
    //     intervalRef.current = setInterval(addChar, 110);
    //
    //     return () => {
    //         clearInterval(intervalRef.current);
    //         clearInterval(blinkIntervalRef.current);
    //     };
    // }, []);

    useEffect(() => {
        if (selectedRoute && selectedRoute !== previousRoute) {
            handleSubmit();
        }
    }, [selectedRoute, previousRoute]);

    const toggleModal = () => {
        const synth = window.speechSynthesis;
        synth.cancel();
        setModalOpen(!isModalOpen);
    };

    const handleRouteChange = (event) => {
        setPreviousRoute(selectedRoute);
        setSelectedRoute(event.target.value);
        console.log("Route changed:", event.target.value);
    };

    const handleSubmit = () => {
        console.log("Form submitted. Selected Route:", selectedRoute);
        if (selectedRoute) {
            navigate(`/restarea/${selectedRoute}`);
        }
    };

    const fetchLocationAndData = () => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            axios.post('http://localhost:5000/api/gas-stations', {
                latitude,
                longitude
            })
                .then(response => {
                    setGasStations(response.data);
                    console.log('넘어온 데이터:', response.data);
                })
                .catch(error => {
                    console.error('데이터 에러:', error);
                });
        }, error => {
            console.error('Error getting location:', error);
        });
    };

    useEffect(() => {
        fetchLocationAndData();
    }, []);

    const scrollToWhiteBackground = () => {
        console.log('styles.white_background:', styles.white_background);
        const whiteBackgroundElement = document.querySelector(`.${CSS.escape(styles.white_background)}`);
        if (whiteBackgroundElement) {
            whiteBackgroundElement.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.error('white_background element not found');
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(styles.animate);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        const chartElements = document.querySelectorAll(`.${CSS.escape(styles.chart)}, .${CSS.escape(styles.chart2)}, .${CSS.escape(styles.chart3)}`);
        chartElements.forEach(el => observer.observe(el));

        const subBoxElements = document.querySelectorAll(`.${CSS.escape(styles.sub_box)}, .${CSS.escape(styles.sub_box2)}, .${CSS.escape(styles.sub_box3)}`);
        subBoxElements.forEach(el => observer.observe(el));

        return () => {
            chartElements.forEach(el => observer.unobserve(el));
            subBoxElements.forEach(el => observer.unobserve(el));
        };
    }, []);

    return (
        <div className={styles.main_page}>
            <div className={styles.top_box}>

                <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                    <ul>
                        <li>
                            <div className={styles.select_container}>
                                <select
                                    id={styles.select}
                                    value={selectedRoute}
                                    onChange={handleRouteChange}
                                >
                                    <option value="" disabled hidden>
                                        {isPlaceholderVisible ? placeholderText : ""}
                                    </option>
                                    <optgroup style={{color: 'darkblue'}}>
                                        <option value="동해선">동해선</option>
                                        <option value="중부내륙선">중부내륙선</option>
                                        <option value="호남선">호남선</option>
                                        <option value="수도권제1순환선">수도권제1순환선</option>
                                        <option value="울산포항선">울산포항선</option>
                                        <option value="상주영덕선">상주영덕선</option>
                                        <option value="서울양양선">서울양양선</option>
                                        <option value="광주대구선">광주대구선</option>
                                        <option value="주용로">주용로</option>
                                        <option value="군도7호">군도7호</option>
                                        <option value="평택제천선">평택제천선</option>
                                        <option value="상주영천선">상주영천선</option>
                                        <option value="지방도">지방도</option>
                                        <option value="수도권제2순환선(봉담-동탄)">수도권제2순환선(봉담-동탄)</option>
                                        <option value="진무로">진무로</option>
                                        <option value="일반국도7호선">일반국도7호선</option>
                                        <option value="익산장수선">익산장수선</option>
                                        <option value="중앙선">중앙선</option>
                                        <option value="밀양울산선">밀양울산선</option>
                                        <option value="중앙선(대구-부산)">중앙선(대구-부산)</option>
                                        <option value="인천국제공항선">인천국제공항선</option>
                                        <option value="진용로">진용로</option>
                                        <option value="부산외곽선">부산외곽선</option>
                                        <option value="호남지선">호남지선</option>
                                        <option value="부산울산선">부산울산선</option>
                                        <option value="호남선(천안-논산)">호남선(천안-논산)</option>
                                        <option value="국도3호선">국도3호선</option>
                                        <option value="호남고속도로">호남고속도로</option>
                                        <option value="대전통영선">대전통영선</option>
                                        <option value="중부선">중부선</option>
                                        <option value="남해선">남해선</option>
                                        <option value="중부내륙">중부내륙</option>
                                        <option value="중부내륙지선">중부내륙지선</option>
                                        <option value="대구포항선">대구포항선</option>
                                        <option value="평택시흥선">평택시흥선</option>
                                        <option value="무안광주선">무안광주선</option>
                                        <option value="경부선">경부선</option>
                                        <option value="당진영덕선">당진영덕선</option>
                                        <option value="서천공주선">서천공주선</option>
                                        <option value="세종포천선(구리-포천)">세종포천선(구리-포천)</option>
                                        <option value="서해안선">서해안선</option>
                                        <option value="영동선">영동선</option>
                                        <option value="순천완주선">순천완주선</option>
                                        <option value="광주원주선">광주원주선</option>
                                        <option value="서울양양선(서울-춘천)">서울양양선(서울-춘천)</option>
                                        <option value="서울외곽순환선">서울외곽순환선</option>
                                    </optgroup>
                                </select>
                            </div>
                        </li>
                    </ul>
                </form>

                <div className={styles.arrow_down} onClick={scrollToWhiteBackground}></div>

                <div className={styles.chat} onClick={toggleModal}>
                    CHAT BOT
                </div>

                {isModalOpen && (
                    <Modal isOpen={isModalOpen} onClose={toggleModal}>
                        <ChatBot />
                    </Modal>
                )}
            </div>

            <div className={styles.white_background}>
                <div className={styles.outer}>
                    {/* 첫번째 차트 */}
                    <div className={styles.chart_container}>
                        <div className={styles.chart}>
                            <NearbyGasChart data={gasStations} />
                        </div>
                        <div className={`${styles.sub_box} fade-in`}>
                            <div className={styles.chart_sub}>
                                <h2>내 주변 주유소</h2>
                                <span>테스트 글임 테스트 글임 테스트 글임 테스트 글임</span>
                            </div>
                        </div>
                    </div>
                    {/* 두번째 차트 */}
                    <div className={styles.chart_container2}>
                        <div className={styles.chart2}>
                            <NationalGasPricesChart />
                        </div>
                        <div className={`${styles.sub_box2} fade-in`}>
                            <div className={styles.chart_sub2}>
                                {/*<h2>내 주변 주유소</h2>*/}
                                {/*<span>테스트 글임 테스트 글임 테스트 글임 테스트 글임</span>*/}
                            </div>
                        </div>
                    </div>
                    {/* 세번째 차트 */}
                    <div className={styles.chart_container3}>
                        <div className={styles.chart3}>
                            <Chart7 />
                        </div>
                        <div className={`${styles.sub_box3} fade-in`}>
                            <div className={styles.chart_sub3}>
                                <h2>내 주변 주유소</h2>
                                <span>테스트 글임 테스트 글임 테스트 글임 테스트 글임</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage;
