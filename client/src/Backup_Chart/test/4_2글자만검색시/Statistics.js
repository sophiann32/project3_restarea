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
    const [OilAddress, setOilAddress] = useState('');
    const handleSearch = () => {
        axios.get('http://localhost:5000/api/search', {
            params: {
                code: 'F240409104',
                out: 'json',
                osnm: searchValue,
            },
        })
            .then((finding) => {
                const data = finding.data;
                setOilAddress(data[0].address);
            })
            .catch(() => {
                console.log('Failed to fetch data');
            });
    };

    // 컴포넌트 마운트 시 자동으로 위치 정보를 불러오고 데이터를 요청
    useEffect(() => {
        fetchLocationAndData();
    }, []);
    // let[oilPrice,setOilPrice] = useState()
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
                        <p> 주소: {OilAddress}</p>
                        <div className={styles.results}>
                            {/* 검색 결과를 여기에 표시 */}
                        </div>


                    </div>
                </div>
                <div className={styles.box2}>
                <div className={styles.chartContainer}>
                        <div className={styles.smallbox2}>
                            <NationalGasPricesChart/>
                        </div>
                        <div className={styles.smallbox3}>
                            <EV_ChargingSlots/>
                        </div>
                        <div className={styles.smallbox2}>
                            <Chart7/>
                        </div>
                        <div className={styles.smallbox3}>
                            <NearbyGasChart data={locationData}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Statistics;
