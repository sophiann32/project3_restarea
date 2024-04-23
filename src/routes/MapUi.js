import {React,useState,useEffect} from 'react';
import Elec_station from "../kako_map/elec_station";

import styles from './map_ui.module.css'
import ChangeOverlay2 from "../kako_map/map_type";
import MapInfo from "../kako_map/gas_station";
import GasStation from "../kako_map/map_type";


function MapUi() {

    let[list1,setList1] = useState(1)
    const [radius, setRadius] = useState(1); // 기본값은 1km
    const [gasStations, setGasStations] = useState([
        { name: '주유소 A', price: 1500, distance: 0.5 },
        { name: '주유소 B', price: 1450, distance: 0.8 },
        // ... 더미 데이터 추가 ...
        { name: '주유소 T', price: 1570, distance: 1.2 },
    ]);

    // 정렬 함수들
    const sortByPrice = () => {
        const sortedStations = [...gasStations].sort((a, b) => a.price - b.price);
        setGasStations(sortedStations);
    };

    const sortByDistance = () => {
        const sortedStations = [...gasStations].sort((a, b) => a.distance - b.distance);
        setGasStations(sortedStations);
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
                    <div className={styles.sortButtons}>
                        <button onClick={sortByPrice}>가격순 정렬</button>
                        <button onClick={sortByDistance}>거리순 정렬</button>
                    </div>
                    {/* 주유소 리스트 */}
                    <ul className={styles.gasStationList}>
                        {gasStations.map((station, index) => (
                            <li key={index}>
                                <span>{station.name}</span> -
                                <span>{station.price}원</span> -
                                <span>{station.distance}km</span>
                            </li>
                        ))}
                    </ul>


                </div>
                {
                    list1 == 1 ? <section className={styles.section}><GasStation/></section> :
                        list1 == 2 ? <section className={styles.section}><Elec_station/></section> :
                            <section className={styles.section}><MapInfo/></section>
                }

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

// function MapUiList1() {
//     return (
//         <>
//         <div id={styles.list}>
//                 근처 주유소 찾기
//
//             </div>
//
//         </>
//     )
// }


export default MapUi