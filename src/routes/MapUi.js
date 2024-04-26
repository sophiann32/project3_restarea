import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Elec_station from "../kako_map/elec_station";
import styles from './map_ui.module.css'
import MapInfo from "../kako_map/map_info";
import GasStation from "../kako_map/gas_station";

function convertMetersToKilometers(meters) {
    return (meters / 1000).toFixed(2); // 미터를 킬로미터로 변환 후, 소수점 둘째 자리까지 표현
}

function MapUi() {

    let [list1, setList1] = useState(1)
    const [radius, setRadius] = useState(1); // 기본값은 1km
    const [gasStations, setGasStations] = useState([]);
    const [gasStationCount, setGasStationCount] = useState(0); // 주유소 개수를 저장하는 상태
    const [selectedSort, setSelectedSort] = useState(''); // 버튼 상태 저장하는 스테이트
    const [fuelType, setFuelType] = useState('B027'); // 초기값은 휘발유


    const fetchStationsWithRadius = (radiusValue) => {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords;
            axios.post('http://localhost:5000/get-stations', {
                latitude,
                longitude,
                radius: radiusValue * 1000,
                prodcd: fuelType
            })
                .then(response => {
                    console.log('API 응답 데이터:', response.data);
                    setGasStationCount(response.data.length)
                    setGasStations(response.data);
                    if (response.data.length === 0) {
                        // 데이터가 없는 경우 상태를 업데이트하여 주변에 주유소가 없다고 표시
                        setGasStations([]);

                    } else {
                        // 응답 데이터로 주유소 상태를 업데이트합니다.
                        setGasStations(response.data);
                    }
                })
                .catch(error => {
                    console.error('주유소 정보를 가져오는데 실패했습니다.', error);
                    setGasStations([]); // 에러 발생 시 상태를 비워줌
                    setGasStationCount(0); // 에러 발생 시 0 표시
                });
        }, err => {
            console.error(err);
            setGasStations([]); // 위치 정보를 가져오는데 실패한 경우
        });
    };

    useEffect(() => {
        fetchStationsWithRadius(radius);
    }, [radius, fuelType]);

    // 정렬 함수들
    const sortByPrice = () => {
        const sortedStations = [...gasStations].sort((a, b) => a.price - b.price);
        setGasStations(sortedStations);
        setSelectedSort('price');
    };

    const sortByDistance = () => {
        const sortedStations = [...gasStations].sort((a, b) => a.distance - b.distance);
        setGasStations(sortedStations);
        setSelectedSort('distance');
    };


    return (
        <>


            <div id={styles.change}>
                <div className={styles.aside}>


                    <div className={styles.markings}>
                        <span className={styles.mark}>1km</span>
                        <span className={styles.mark}>3km</span>
                        <span className={styles.mark}>5km</span>
                    </div>
                    {/* 슬라이더 */}

                    <input
                        type="range"
                        id="radiusSlider"
                        name="radius"
                        min="1"
                        max="5"
                        step="2" // 1, 3, 5만 선택 가능
                        value={radius}
                        onChange={e => setRadius(e.target.value)}
                        className={styles.slider}
                        list="tickmarks"
                    />

                    {/* 눈금에 대한 리스트 정의 */}
                    <datalist id="tickmarks">
                        <option value="1" label="1km">1km</option>
                        <option value="3" label="3km">3km</option>
                        <option value="5" label="5km">5km</option>
                    </datalist>

                    {/* 정렬 버튼 */}
                    <div className={styles.change}>
                        <div className={styles.sortButtons}>
                            <button onClick={sortByPrice}
                                    style={selectedSort === 'price' ? {backgroundColor: '#e72f2f'} : null}>
                                가격순
                            </button>
                            <button onClick={sortByDistance}
                                    style={selectedSort === 'distance' ? {backgroundColor: '#e72f2f'} : null}>
                                거리순
                            </button>
                        </div>
                    </div>
                    <h3 style={{
                        color: 'white',
                        position: 'absolute',
                        left: '310px',
                        top: '75px'
                    }}> {gasStationCount}개</h3>
                    {/* 주유소 리스트 */}
                    <ul className={styles.gasStationList}>
                        {gasStations.length > 0 ? (
                            gasStations.map((station, index) => (
                                <li key={index}>
                                    <span>{station.name}</span> -
                                    <span>{station.price}원</span> -
                                    <span>{convertMetersToKilometers(station.distance)}km</span>
                                </li>
                            ))
                        ) : (
                            <li>선택한 범위 내에 주유소가 없습니다.</li>
                        )}
                    </ul>
                </div>
                {
                    list1 === 1 ? (
                            <section className={styles.section}>
                                <GasStation radius={radius} stations={gasStations}/>
                            </section>
                        ) :
                        list1 == 2 ? <section className={styles.section}><Elec_station/></section> :
                            <section className={styles.section}><MapInfo/></section>
                }
                <div className={styles.radioContainer}>
                    <label>
                        <input type="radio" name="fuelType" value="B027"
                               checked={fuelType === 'B027'} onChange={() => setFuelType('B027')}/>
                        <span className={styles.checkmark}></span>
                        휘발유
                    </label>
                    <label>
                        <input type="radio" name="fuelType" value="D047"
                               checked={fuelType === 'D047'} onChange={() => setFuelType('D047')}/>
                        <span className={styles.checkmark}></span>
                        경유
                    </label>
                    <label>
                        <input type="radio" name="fuelType" value="B034"
                               checked={fuelType === 'B034'} onChange={() => setFuelType('B034')}/>
                        <span className={styles.checkmark}></span>
                        고급 휘발유
                    </label>
                    <label>
                        <input type="radio" name="fuelType" value="C004"
                               checked={fuelType === 'C004'} onChange={() => setFuelType('C004')}/>
                        <span className={styles.checkmark}></span>
                        실내등유
                    </label>
                    <label>
                        <input type="radio" name="fuelType" value="K015"
                               checked={fuelType === 'K015'} onChange={() => setFuelType('K015')}/>
                        <span className={styles.checkmark}></span>
                        자동차 부탄
                    </label>
                </div>

                <div className={styles.buttonContainer}>
                    <button
                        className={`${styles.button} ${list1 === 1 ? styles.buttonActive : ''}`}
                        onClick={() => setList1(1)}
                    >
                        주유소
                    </button>
                    <button
                        className={`${styles.button} ${list1 === 2 ? styles.buttonActive : ''}`}
                        onClick={() => setList1(2)}
                    >
                        충전소
                    </button>
                </div>


            </div>


            <div className={styles.select_bar}>
                <div className={styles.select_item}>
                    <img src="/img/fuel.png" alt="Icon 1" className={styles.icon}/>
                    <p className={styles.text}>내 주변 주유소</p>
                    <button className={styles.button1}>주유소</button>
                </div>

                <div className={styles.select_item}>
                    <img src="/img/elc.png" alt="Icon 2" className={styles.icon}/>
                    <p className={styles.text}>내 주변 충전소</p>
                    <button className={styles.button2}>충전소</button>
                </div>

                <div className={styles.select_item}>
                    <img src="/img/live.png" className={styles.icon2}/>
                    <p className={styles.text2}>충전가능한 충전소보기</p>
                    <button className={styles.button3}>충전가능한 충전소</button>
                </div>
            </div>

        </>
    )
}


export default MapUi