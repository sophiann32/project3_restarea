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





    // 컴포넌트 마운트 시 자동으로 위치 정보를 불러오고 데이터를 요청
    useEffect(() => {
        fetchLocationAndData();
    }, []);
    let[oilPrice,setOilPrice] = useState()
    return (
        <>
            <div className={styles.statistics}>
                <div className={styles.box1}>
                    <div className={styles.smallbox1}>
                        <button onClick={
                            () => {
                                axios.get('http://localhost:5000/api/search')
                                    .then((response) => {
                                        // [[배열 요소1], [배열요소2]] ==> 하나의 배열로 병합
                                        // concat등의 메소드 활용가능
                                        let shoesCopy = response.data
                                        // 추가 작업
                                        console.log(shoesCopy[0])
                                        // setOilPrice(...shoesCopy[0])
                                    })
                                    // 응답에 실패한 경우, 예외처리 코드 정의
                                    .catch(() => {
                                        console.log('111111실패함');
                                    })
                            }
                        }> (OpenApi자료) 파이참 oill 데이터 키면 콘솔에 데이터가 한글로 찍힘
                        </button>
                        {oilPrice}


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
