import React, { useState } from 'react';
import styles from './main_page.module.css'
import Modal from './Modal';
import {useNavigate} from 'react-router-dom';
import ChatBot from '../chatbot/chat';

function MainPage() {
    const [selectedRoute, setSelectedRoute] = useState('');
    const navigate = useNavigate();
    const [isModalOpen, setModalOpen] = useState(false);

    const toggleModal = () => setModalOpen(!isModalOpen);

    const handleRouteChange = (event) => {
        setSelectedRoute(event.target.value);
        console.log("Route changed:", event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Form submitted. Selected Route:", selectedRoute);
        if (selectedRoute) {
            navigate(`/restarea/${selectedRoute}`);
        }
    };
    return (
        <>
            <div className={styles.main_page}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <ul>
                        <li>
                            <label className={styles.label} htmlFor="class">휴게소</label>
                            <select id={styles.select} value={selectedRoute} onChange={handleRouteChange}>
                                <option value="" disabled selected hidden>🔍 원하는 도로의 휴게소 정보를 확인하세요</option>
                                {/* 고속도로 옵션들 */}
                                <optgroup style={{color:'darkblue'}} label="북쪽">

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

                                </optgroup>
                                <optgroup label="짧은거">
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
                        </li>
                    </ul>

                    <button className={styles.mainButton} type="submit">검색</button>
                </form>
                <div className={styles.chat} onClick={toggleModal}>
                    CHAT BOT
                </div>
                {isModalOpen && (
                    <Modal isOpen={isModalOpen} onClose={toggleModal}>
                        <ChatBot />
                    </Modal>
                )}
            </div>
        </>
    );
}

export default MainPage;