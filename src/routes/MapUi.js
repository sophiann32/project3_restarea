// React 및 관련 훅과 axios를 임포트함
import React, {useState, useEffect} from 'react';
import axios from 'axios';

// 컴포넌트 및 스타일시트 파일 임포트
import Elec_station from "../kako_map/elec_station";
import styles from './map_ui.module.css'
import MapInfo from "../kako_map/map_info";
import GasStation from "../kako_map/gas_station";











// 미터 단위를 킬로미터로 변환하는 함수
function convertMetersToKilometers(meters) {
    return (meters / 1000).toFixed(2); // 미터를 킬로미터로 변환 후, 소수점 둘째 자리까지 표현
}

// MapUi 컴포넌트 정의
function MapUi() {
    // 여러 상태 변수 선언
    let [list1, setList1] = useState(1)
    const [radius, setRadius] = useState(1); // 검색 반경 초기값을 1km로 설정
    const [gasStations, setGasStations] = useState([]); // 주유소 데이터를 저장할 상태
    const [gasStationCount, setGasStationCount] = useState(0); // 주유소 개수를 저장하는 상태
    const [selectedSort, setSelectedSort] = useState(''); // 선택된 정렬 방식을 저장하는 상태
    const [fuelType, setFuelType] = useState('B027'); // 연료 유형의 초기값 설정 (휘발유)
    const [chargingStations, setChargingStations] = useState([]); // 충전소 데이터 저장 상태
    const [chargingStationCount, setChargingStationCount] = useState(0); // 충전소 개수 저장 상태

    // 주유소 정보를 반경에 따라 가져오는 함수
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

    // 충전소 정보를 가져오는 비동기 함수
    const fetchChargingStations = async () => {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            const { latitude, longitude } = position.coords;
            const response = await axios.post('http://localhost:3001/find-stations', {
                latitude,
                longitude,
                radius: radius * 1000 // 미터 단위로 변환하여 서버로 전송
            });

            console.log('충전소 데이터임', response.data);
            // 매칭된 충전소 데이터만 상태에 저장
            setChargingStations(response.data.matchingChargerData);
            setChargingStationCount(response.data.matchingChargerData.length);

        } catch (error) {
            console.error('충전소 정보를 가져오는데 실패했음.', error);
            // 위치 가져오기 실패 또는 Axios 요청 실패 처리
            setChargingStations([]);
            setChargingStationCount(0);
        }
    };

    // 컴포넌트 마운트 후 반경과 연료 유형에 따라 주유소 정보를 가져오도록 설정
    useEffect(() => {
        fetchStationsWithRadius(radius);
    }, [radius, fuelType]);

    // list1 상태가 변경될 때마다 주유소 또는 충전소 정보를 가져오도록 설정
    useEffect(() => {
        if (list1 === 1) {
            fetchStationsWithRadius(radius);
        } else if (list1 === 2) {
            fetchChargingStations();
        }
    }, [list1, radius]);

    // 주유소 정보를 가격 또는 거리 순으로 정렬하는 함수들
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


    const [isVisible, setIsVisible] = useState(true);
    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };



    // 컴포넌트가 렌더링할 JSX 구조
    return (
        <>
            <div id={styles.change}>


                <label className={styles.aside_button} onClick={toggleVisibility}>
                    {isVisible ? (
                        <img src="https://images.emojiterra.com/twitter/v14.0/512px/274e.png" alt="button image"
                             style={{width: 50, height: 50}}/>
                    ) : (
                        <img src="https://images.emojiterra.com/google/noto-emoji/unicode-15/animated/2705.gif"
                             alt="clicked image" style={{width: 50, height: 50}}/>
                    )}
                </label>
                {isVisible &&
                    <div className={styles.aside}>


                        {/* 주유소와 충전소 전환 버튼 */}
                        <div className={styles.buttonContainer}>
                            <button
                                className={`${styles.button} ${list1 === 1 ? styles.buttonActive : ''}`}
                                onClick={() => setList1(1)}>
                                주유소
                            </button>
                            <button
                                className={`${styles.button} ${list1 === 2 ? styles.buttonActive : ''}`}
                                onClick={() => setList1(2)}>
                                충전소
                            </button>
                        </div>


                        {/* 반경 선택 슬라이더 */}
                        <div className={styles.markings}>
                            <span className={styles.mark}>1km</span>
                            <span className={styles.mark}>3km</span>
                            <span className={styles.mark}>5km</span>
                        </div>
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
                                {list1 === 1 && (
                                    <button onClick={sortByPrice}
                                            style={selectedSort === 'price' ? {backgroundColor: '#a25fa6'} : null}>
                                        가격순
                                    </button>
                                )}
                                {list1 === 1 && (
                                    <button onClick={sortByDistance}
                                            style={selectedSort === 'distance' ? {backgroundColor: '#a25fa6'} : null}>
                                        거리순
                                    </button>
                                )}
                            </div>
                        </div>
                        {/* 선택된 주유소 또는 충전소의 개수를 표시 */}
                        <h3 style={{color: '#a15ea5', position: 'absolute', left: '370px', top: '150px'}}>
                            {list1 === 1 ? gasStationCount : chargingStationCount}개
                        </h3>
                        {/* 주유소 또는 충전소 리스트 */}
                        <ul style={{position: 'relative', right: '20px', top: '20px', fontSize: '16px'}}
                            className={styles.gasStationList}>
                            {list1 === 1 && gasStations.length > 0 ? (
                                gasStations.map((station, index) => (
                                    <li key={index}>
                                        <span style={{ fontSize: '16px'}}>{station.name} </span>
                                        <span style={{fontSize: '16px',fontWeight: "bold"}}>{station.price}원   </span>
                                        <span
                                            style={{fontSize: '16px'}}>{convertMetersToKilometers(station.distance)}km</span>
                                    </li>
                                ))
                            ) : list1 === 2 && chargingStations.length > 0 ? (
                                chargingStations.map((station, index) => (
                                    <li key={index}>
                                        <span>{station.statNm}</span> -
                                        <span>{station.addr}</span>
                                    </li>
                                ))
                            ) : (
                                <li>선택한 범위 내에 정보가 없습니다.</li>
                            )}
                        </ul>
                    </div>

                } {/*버튼으로 사이트 바 열고 닫는 자바스크랩트 닫는 괄호임*/}


                {/* 주유소 또는 충전소를 지도에 표시하는 섹션 */}
                {
                    list1 === 1 ? (
                        <section className={styles.section}>
                            <GasStation radius={radius} stations={gasStations}/>
                        </section>
                    ) : list1 === 2 ? (
                        <section className={styles.section}>
                            <Elec_station locations={chargingStations} radius={radius}/>

                        </section>
                    ) : (
                        <section className={styles.section}><MapInfo/></section>
                    )}
                {/* 연료 유형 선택 라디오 버튼 */}
                {list1 === 1 && (
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
                )}


            </div>
            {/*아이콘과 버튼을 포함한 선택 바*/}
            <div className={styles.select_bar}>
                <div className={styles.select_item}>
                    <img src="/img/fuel.png" alt="Icon 1" className={styles.icon}/>
                    <p className={styles.text}>내 주변 주유소</p>
                    <div className={styles.button1}>주유소</div>
                </div>
                <div className={styles.select_item}>
                    <img src="/img/elc.png" alt="Icon 2" className={styles.icon}/>
                    <p className={styles.text}>내 주변 충전소</p>
                    <div className={styles.button2}>충전소</div>
                </div>
                <div className={styles.select_item}>
                    <img src="/img/live.png" className={styles.icon2}/>
                    <p className={styles.text2}>충전가능한 충전소보기</p>
                    <div className={styles.button3}>충전가능한 충전소</div>
                </div>
            </div>
        </>
    )
}

// 컴포넌트를 내보내서 다른 곳에서 사용할 수 있게 함
export default MapUi
