import React, {useState} from 'react';
import styles from './SearchOilCharge.module.css';
import axios from "axios";

function SearchOilCharge() {
    const [searchValue, setSearchValue] = useState('');
    const [Forwardings, setForwarding] = useState([]);
    const [selectedArea, setSelectedArea] = useState('');
    const [IsCarWash, setIsCarWash] = useState('Y');
    const [selectedStation, setSelectedStation] = useState(null);
    const [carWashInfo, setCarWashInfo] = useState(null);
    const handleSearch = () => {
        axios.get('http://localhost:5000/api/gas-stations', {
            params: {
                code: 'F240411107',
                out: 'json',
                osnm: searchValue,
                area: selectedArea,

            },
        })
            .then((finding) => {
                const FindingStations = finding.data;
                setForwarding(FindingStations);
            })
            .catch(() => {
                console.log('Failed to fetch data');
            });
    };
    const handleStationClick = (station) => {
        setSelectedStation(station);
        axios.get('http://localhost:5000/api/gas-station-detail', {
            params: {
                uni_id: station.uni_id,
            },
        })
            .then((response) => {
                const detail = response.data;
                const carWashStatus = detail.RESULT.OIL[0].CAR_WASH_YN;
                setIsCarWash(carWashStatus);
                setCarWashInfo({
                    oilPrice: detail.RESULT.OIL_PRICE[0].PRICE,
                    tel: detail.RESULT.OIL[0].TEL
                })

            })
            .catch((error) => {
                console.error(error);
            });
    };

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
                return 'LPG 충전소';
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
    return (
            <div className={styles.smallbox1}>
                <div className={styles.searchInputContainer}>
                    <h2 className={styles.h2}> ⛽ 상호명으로 상세 검색 </h2>
                    <input
                        className={styles.searchInput}
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="(주유소,가스충전소 2글자 이상)"
                    />
                    <select
                        className={styles.searchArea}
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
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
                    <button
                        className={styles.searchButton}
                        onClick={handleSearch}
                    > 주소,공급업체 확인
                    </button>
                </div>

                <div className={styles.chartContainer}>
                    {Forwardings && Forwardings.map((Forwarding, index) => {
                        console.log('Forwarding:', Forwarding); // log the Forwarding object
                        return (
                            <div
                                className={styles.results}
                                key={index}
                                onClick={() => handleStationClick(Forwarding)}
                            >
                                <div className={styles.results} key={index}>
                                    <p>상호명: {Forwarding.name}</p>
                                    <p>주소: {Forwarding.address}</p>
                                    {(getLPGYN(Forwarding['LPG_YN']) !== '-') &&
                                        <p>업종 구분: {getLPGYN(Forwarding['LPG_YN'])}</p>}
                                    {(getGasTradeName(Forwarding['Gas_Trade_name']) !== '-') &&
                                        <p>주유소 공급업체명: {getGasTradeName(Forwarding['Gas_Trade_name'])}</p>}
                                    {(getChargeTradeName(Forwarding['Charge_Trade_name']) !== '-') &&
                                        <p>가스충전소 공급업체명: {getChargeTradeName(Forwarding['Charge_Trade_name'])}</p>}
                                    {selectedStation && selectedStation.uni_id === Forwarding.uni_id && (
                                        <div>
                                            <p>세차장: {IsCarWash === "Y" ? '있음🫧' : '없음❌'}</p>
                                            {carWashInfo && (
                                                <div>
                                                    <p>세차장 정보:</p>
                                                    <ul>
                                                        <li>오일 가격: {carWashInfo.oilPrice}</li>
                                                        <li>전화번호: {carWashInfo.tel}</li>

                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
    );
}

export default SearchOilCharge;
