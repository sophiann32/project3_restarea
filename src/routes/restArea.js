import React, { useState, useEffect } from 'react';
import styles from './restArea.module.css';
import axios from 'axios';
import RestAreaDetail from "../kako_map/restAreaDetail";
import Modal from '../Modal/Modal';

function RestArea() {
    const [selectedRoute, setSelectedRoute] = useState('');
    const [restAreas, setRestAreas] = useState([]);
    const [selectedRestArea, setSelectedRestArea] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const normalizeName = (name) => {
        return name.replace(/휴게소$/, '').trim();
    };

    useEffect(() => {
        if (selectedRoute) {
            axios.get(`http://localhost:5000/restareas?route=${selectedRoute}`)
                .then(response => {
                    const areas = response.data;
                    return axios.get(`http://localhost:5000/facilities?routeNm=${selectedRoute}`)
                        .then(response => {
                            const facilityData = response.data;
                            // facilityData.list가 배열인지 확인
                            if (!facilityData || !Array.isArray(facilityData.list)) {
                                console.error('Expected facilityData.list to be an array, but received:', facilityData);
                                return; // 배열이 아니면 함수 종료
                            }
                            // facilities 데이터를 restAreas에 매핑
                            const updatedAreas = areas.map(area => {
                                const facility = facilityData.list.find(f => normalizeName(f.serviceAreaName) === normalizeName(area.휴게소명));
                                return {
                                    ...area,
                                    convenience: facility ? facility.convenience : '정보 없음'
                                };
                            });
                            setRestAreas(updatedAreas);
                        });
                })
                .catch(error => console.error('Error fetching data: ', error));
        } else {
            setRestAreas([]);
        }
    }, [selectedRoute]);



    const handleAreaClick = (area) => {
        setSelectedRestArea(area);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };


    return (
        <>
            <div id={styles.main}>
                <div className={styles.restAreaTab}>
                    <select value={selectedRoute} onChange={e => setSelectedRoute(e.target.value)}>
                        <option value="">노선을 선택하세요</option>
                        <option value="">노선을 선택하세요</option>
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
                    </select>
                    <ul>
                        {restAreas.map((area, index) => (
                            <li key={index} className={styles.restAreaItem} onClick={() => handleAreaClick(area)}>
                                {`${area.휴게소명} - ${area.convenience}`}
                            </li>
                        ))}
                    </ul>
                </div>
                <Modal isOpen={modalOpen} onClose={handleCloseModal}>
                    <div>
                        <h2>{selectedRestArea ? selectedRestArea.휴게소명 : '휴게소 이름'}</h2>
                        <p>위치: {selectedRestArea ? selectedRestArea.위치 : '휴게소 위치 정보'}</p>
                        <p>서비스: {selectedRestArea ? selectedRestArea.서비스 : '기본 서비스 정보'}</p>
                        <p>연락처: {selectedRestArea ? selectedRestArea.연락처 : '연락처 정보'}</p>
                    </div>
                </Modal>
                <section className={styles.restAreaMap}>
                    <RestAreaDetail selectedRoute={selectedRoute} restAreas={restAreas}/>
                </section>
            </div>
        </>
    );
}

export default RestArea;

