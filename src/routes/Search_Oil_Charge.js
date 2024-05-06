import React, {useState} from 'react';
import styles from './Search_Oil_Charge.module.css';
import axios from "axios";

function Search_Oil_Charge() {
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
                setForwarding(FindingStations.map((FindingStation) => ({...FindingStation}))); // Update the Forwardings state to an array of objects
            })
            .catch(() => {
                console.log('Failed to fetch data');
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
        <>
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
                        {/*사용자가 드롭다운에서 옵션을 선택할 때 속성이 올바르게 업데이트되는지 확인 onChange이벤트 핸들러를 사용하여 변수를 업데이트하면 이를 수행할 수 있습니다.*/}
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
                {/*</div>*/}
                <div className={styles.chartContainer}>
                    {Forwardings && Forwardings.map((Forwarding, index) => {
                        console.log('Forwarding:', Forwarding); // log the Forwarding object
                        return (
                            <div className={styles.results} key={index}>
                                <p>상호명: {Forwarding.name}</p>
                                <p>주소: {Forwarding.address}</p>
                                {(getLPGYN(Forwarding['LPG_YN']) !== '-') &&
                                    <p>업종 구분: {getLPGYN(Forwarding['LPG_YN'])}</p>}
                                {(getGasTradeName(Forwarding['Gas_Trade_name']) !== '-') &&
                                    <p>주유소 공급업체명: {getGasTradeName(Forwarding['Gas_Trade_name'])}</p>}
                                {(getChargeTradeName(Forwarding['Charge_Trade_name']) !== '-') &&
                                    <p>가스충전소 공급업체명: {getChargeTradeName(Forwarding['Charge_Trade_name'])}</p>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default Search_Oil_Charge;
