import React, { useState, useRef } from 'react';
import styles from './SearchOilCharge.module.css';
import axios from "axios";
import AudioSwitch from "./Media/AudioSwitch";

function SearchOilCharge() {
    const [searchValue, setSearchValue] = useState('');
    const [Forwardings, setForwarding] = useState([]);
    const [selectedArea, setSelectedArea] = useState('');
    const [IsCarWash, setIsCarWash] = useState('Y');
    const [IsMaint,setIsMaint] = useState('Y');
    const [IsCvs, setIsCvs] = useState('Y');
    const [selectedStation, setSelectedStation] = useState(null);
    const [carWashInfo, setCarWashInfo] = useState(null);
    const audioRef = useRef(null);
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
                console.log('1.서버에 처음 보내고 받은값 :', FindingStations);
                if (audioRef.current) {
                    audioRef.current.play();
                }
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
                const maintStatus = detail.RESULT.OIL[0].MAINT_YN;
                setIsMaint(maintStatus);
                const cvsStatus = detail.RESULT.OIL[0].CVS_YN;
                setIsCvs(cvsStatus);

                const oilPriceArray =detail.RESULT.OIL[0].OIL_PRICE;
                const oilPrices =oilPriceArray.map((price)=>{
                    return{
                        productCode: price.PRODCD,
                        price:price.PRICE,
                        tradeDate:price.TRADE_DT
                    };
                });
                setCarWashInfo({
                    oilPrice :oilPrices,
                    tel: detail.RESULT.OIL[0].TEL,
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
    const getProductName = (productCode) => {
        switch (productCode) {
            case "B027":
                return "휘발유";
            case "C004":
                return "실내등유";
            case "B034":
                return "고급휘발유";
            case "K015":
                return "자동차부탄";
            case "D047":
                return "경유";
        }
    };
    return (
            <div className={styles.smallbox1}>
                <div className={styles.searchInputContainer}>
                    <h2 className={styles.h2}>
                        <AudioSwitch />
                        ⛽ 전국 주유소,가스충전소 검색</h2>

                    <input
                        className={styles.searchInput}
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="(상호명 2글자 이상 필수)"
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
                    >
                        실시간 상세정보 확인
                    </button>
                    <AudioSwitch ref={audioRef} src="/a_car_whizzing_by슝.mp3" />

                </div>

                <div className={styles.chartContainer}>
                    {Forwardings && Forwardings.map((Forwarding, index) => {
                        return (

                            <div className={styles.results} key={index} onClick={() => handleStationClick(Forwarding)}>
                                {/*<span style={{color: "blueviolet", fontSize: "smaller"}}> 클릭 👀 더 자세한 내용을 확인하세요</span>*/}
                                <span style={{color: "blueviolet", fontSize: "smaller"}}> 클릭 👀 더 자세한 내용을 확인하세요</span>
                                <p>상호명: {Forwarding.name}</p>
                                <p>주소: {Forwarding.address}</p>
                                {(getGasTradeName(Forwarding['gas_trade_name']) !== '-') &&
                                    <p>주유소 공급업체명: {getGasTradeName(Forwarding['gas_trade_name'])}</p>}
                                {(getChargeTradeName(Forwarding['charge_trade_name']) !== '-') &&
                                    <p>가스충전소 공급업체명: {getChargeTradeName(Forwarding['charge_trade_name'])}</p>}
                                {selectedStation && selectedStation.uni_id === Forwarding.uni_id && (
                                    <div>
                                        <p>세차장: {IsCarWash === "Y" ? '있음🚿' : '없음'}</p>
                                        <p>정비시설: {IsMaint.MAINT_YN === "Y" ? '있음🪧' : '없음'} </p>
                                        <p>편의점: {IsCvs.CVS_YN === "Y" ? '있음🆗' : '없음'}</p>
                                        {carWashInfo && (
                                            <div>
                                                <p>전화번호: {carWashInfo.tel}</p>
                                                {carWashInfo.oilPrice.map((price, index) => (
                                                    <p key={index}>
                                                        {getProductName(price.productCode)}: {price.price.toLocaleString('ko-KR')}원
                                                        <span style={{fontSize: "small"}}> ({price.tradeDate})</span>
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                        );
                    })}
                </div>
            </div>
    );
}

export default SearchOilCharge;
