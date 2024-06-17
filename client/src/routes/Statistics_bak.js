import React, { useState, useEffect } from 'react';
import styles from './statistics.module.css';
import axios from "axios";
import NationalGasPricesChart from './Chart/NationalGasPricesChart.js';
import NearbyGasChart from './Chart/NearbyGasChart.js';
import EVChargingSlots from './Chart/EVChargingSlots.js';
import Chart7 from "./Chart/Chart7";
import SearchOilCharge from './SearchOilCharge';

function Statistics() {
    const [locationData, setLocationData] = useState(null);

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
    useEffect(() => {
        fetchLocationAndData();
    }, []);


    return (
        <>
        <div className={styles.statistics}>
            <div className={styles.box1}>
                    <SearchOilCharge/>
            </div>
            <div className={styles.box2}>
                    <div className={styles.chartContainer2}>
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
                            <EVChargingSlots/>
                        </div>
                    </div>

                </div>
            </div>

        </>
    );
}

export default Statistics;
