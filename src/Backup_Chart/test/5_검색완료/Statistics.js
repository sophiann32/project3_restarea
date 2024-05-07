import React, { useState, useEffect } from 'react';
import styles from './statistics.module.css';
import axios from "axios";
import NationalGasPricesChart from './Chart/NationalGasPricesChart.js';
import NearbyGasChart from './Chart/NearbyGasChart.js';
import EV_ChargingSlots from './Chart/EV_ChargingSlots.js';
import Chart7 from "./Chart/Chart7";

function Statistics() {
    const [locationData, setLocationData] = useState(null);
    // 위치 정보를 가져오고 데이터를 로드하는 함수
    const fetchLocationAndData = () => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            axios.post('http://localhost:5000/api/gas-stations', {
                latitude,
                longitude
            })
                .then(response => {
                    setLocationData(response.data);
                    console.log('넘어온 데이터:', response.data);
                })
                .catch(error => {
                    console.error('데이터 에러:', error);
                });
        }, error => {
            console.error('Error getting location:', error);
        });
    };


    //추가
    const [searchValue, setSearchValue] = useState('');
    const [Forwardings, setForwarding] = useState('');
    const [selectedArea, setSelectedArea] = useState('');
    const handleSearch = () => {
        axios.get('http://localhost:5000/api/search', {
            params: {
                code: 'F240409104',
                out: 'json',
                osnm: searchValue,
                area: selectedArea,
            },
        })
            .then((finding) => {
                const FindingStations = finding.data;
                setForwarding(FindingStations.map((FindingStation) => ({ ...FindingStation}))); // Update the Forwardings state to an array of objects
            })
            .catch(() => {
                console.log('Failed to fetch data');
            });
    };
    const handleAreaChange = (event) => {
        setSelectedArea(event.target.value);
    };
    // 컴포넌트 마운트 시 자동으로 위치 정보를 불러오고 데이터를 요청
    useEffect(() => {
        fetchLocationAndData();
    }, []);
    const getGasTradeName = (code) => {
        switch (code) {
            case 'SKE':
                return 'SK에너지';
            case 'GSC':
                return 'GS칼텍스';
            case 'HDO':
                return '현대오일뱅크';
            case 'SOL':
                return 'S-OIL';
            case 'RTE':
                return '자영알뜰';
            case 'RTX':
                return '고속도로 알뜰';
            case 'NHO':
                return '농협알뜰';
            case 'ETC':
                return '자가상표';
            default:
                return '-';
        }
    };

    const getLPGYN = (yn) => {
        switch (yn) {
            case 'N':
                return '주유소';
            case 'Y':
                return '자동차충전소';
            case 'C':
                return '주유소/충전소 겸업';
            default:
                return '-';
        }
    };

    const getChargeTradeName = (code) => {
        switch (code) {
            case 'SKE':
                return 'SK가스';
            case 'GSC':
                return 'GS칼텍스';
            case 'HDO':
                return '현대오일뱅크';
            case 'SOL':
                return 'S-OIL';
            case 'E1G':
                return 'E1';
            case 'SKG':
                return 'SK가스';
            case 'ETC':
                return '자가상표';
            default:
                return '-';
        }
    };
    console.log({Forwardings});
    return (
        <>
            <div className={styles.statistics}>
                <div className={styles.box1}>
                    <div className={styles.smallbox1}>
                        {/* 추가 */}
                        <input
                            className={styles.smallbox1.searchInput}
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="주유소명 (2글자 이상)"
                        />
                        <button
                            className={styles.searchButton}
                            onClick={handleSearch}
                        >상세정보 검색
                        </button>
                        <select
                            value={selectedArea}
                            onChange={handleAreaChange}
                        >
                            <option value="">지역</option>
                            <option value="01">서울</option>
                            <option value="02">경기</option>
                            <option value="03">강원</option>
                            <option value="04">충북</option>
                            <option value="05">충남</option>
                            <option value="06">전북</option>
                            <option value="07">전남</option>
                            <option value="08">경북</option>
                            <option value="09">경남</option>
                            <option value="10">부산</option>
                            <option value="11">제주</option>
                            <option value="14">대구</option>
                            <option value="15">인천</option>
                            <option value="16">광주</option>
                            <option value="17">대전</option>
                            <option value="18">울산</option>
                            <option value="19">세종</option>
                        </select>
                        <div className={styles.results}>

                            {Forwardings && Forwardings.map((Forwarding, index) => (
                                <div key={index}>
                                    <p>주소: {Forwarding.address}</p>
                                    <p>이름: {Forwarding.name}</p>
                                    {(getLPGYN(Forwarding['LPG_YN']) !== '-') && <p>업종 구분: {getLPGYN(Forwarding['LPG_YN'])}</p>}
                                    {(getGasTradeName(Forwarding['POLL_DIV_CD']) !== '-') && <p>주유소 상호: {getGasTradeName(Forwarding['POLL_DIV_CD'])}</p>}
                                    {(getChargeTradeName(Forwarding['GPOLL_DIV_CD']) !== '-') && <p>가스 충전소 상호: {getChargeTradeName(Forwarding['GPOLL_DIV_CD'])}</p>}
                                </div>
                            ))}
                        </div>


                    </div>
                </div>
                <div className={styles.box2}>
                    <div className={styles.chartContainer}>
                        <div className={styles.smallbox2}>
                            <NationalGasPricesChart/>
                        </div>
                        <div className={styles.smallbox3}>
                            <NearbyGasChart data={locationData}/>
                        </div>
                        <div className={styles.smallbox2}>
                            <Chart7/>
                        </div>
                        <div className={styles.smallbox3}>
                            <EV_ChargingSlots/>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Statistics;
