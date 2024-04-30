import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Map, MapMarker } from "react-kakao-maps-sdk";


function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            zIndex: 1000,
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            width: '300px'
        }}>
            <button onClick={onClose} style={{
                position: 'absolute',
                right: '130px',
                top: '180px',
                width: '80px',
                borderRadius: '5px',
                fontSize: '24px',
                cursor: 'pointer',
            }}>

            </button>
            {children}
        </div>
    );
}


function RestAreaDetail() {
    const [position, setPosition] = useState({lat: 36.5, lng: 127.5});
    const [zoomLevel, setZoomLevel] = useState(12);
    const [restAreas, setRestAreas] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRestArea, setSelectedRestArea] = useState(null);

    useEffect(() => {
        if (selectedRoute) {
            axios.get(`http://localhost:5000/restareas?route=${selectedRoute}`)
                .then(response => {
                    setRestAreas(response.data);
                    if (response.data.length > 0) {
                        const firstArea = response.data[0];
                        setPosition({ lat: firstArea.위도, lng: firstArea.경도 });
                    }
                })
                .catch(error => console.error('Error fetching data: ', error));
            setZoomLevel(12);  // 노선이 변경될 때 마다 줌 레벨을 12로 설정
        }
    }, [selectedRoute]);

    const mapStyle = { width: "100%", height: "900px" };

    const handleMarkerClick = area => {
        setSelectedRestArea(area);
        setModalOpen(true);
    };

    return (
        <div>
            <select value={selectedRoute} onChange={e => setSelectedRoute(e.target.value)}>
                <option value="">노선을 선택하세요</option>
                <option value="동해선">동해선</option>
                <option value="중부내륙선">중부내륙선</option>
                <option value="호남선">호남선</option>
                <option value="수도권제1순환선">수도권제1순환선</option>
                <option value="울산포항선">울산포항선</option>
                <option value="상주영덕선">상주영덕선</option>
                <option value="서울양양선">서울양양선</option>
                <option value="광주대구선">광주대구선</option>
                <option value="주용로">주용로</option>
                <option value="군도7호">군도7호</option>
                <option value="평택제천선">평택제천선</option>
                <option value="상주영천선">상주영천선</option>
                <option value="지방도">지방도</option>
                <option value="수도권제2순환선(봉담-동탄)">수도권제2순환선(봉담-동탄)</option>
                <option value="진무로">진무로</option>
                <option value="일반국도7호선">일반국도7호선</option>
                <option value="익산장수선">익산장수선</option>
                <option value="중앙선">중앙선</option>
                <option value="밀양울산선">밀양울산선</option>
                <option value="중앙선(대구-부산)">중앙선(대구-부산)</option>
                <option value="인천국제공항선">인천국제공항선</option>
                <option value="진용로">진용로</option>
                <option value="부산외곽선">부산외곽선</option>
                <option value="호남지선">호남지선</option>
                <option value="부산울산선">부산울산선</option>
                <option value="호남선(천안-논산)">호남선(천안-논산)</option>
                <option value="국도3호선">국도3호선</option>
                <option value="호남고속도로">호남고속도로</option>
                <option value="대전통영선">대전통영선</option>
                <option value="중부선">중부선</option>
                <option value="남해선">남해선</option>
                <option value="중부내륙">중부내륙</option>
                <option value="중부내륙지선">중부내륙지선</option>
                <option value="대구포항선">대구포항선</option>
                <option value="평택시흥선">평택시흥선</option>
                <option value="무안광주선">무안광주선</option>
                <option value="경부선">경부선</option>
                <option value="당진영덕선">당진영덕선</option>
                <option value="서천공주선">서천공주선</option>
                <option value="세종포천선(구리-포천)">세종포천선(구리-포천)</option>
                <option value="서해안선">서해안선</option>
                <option value="영동선">영동선</option>
                <option value="순천완주선">순천완주선</option>
                <option value="광주원주선">광주원주선</option>
                <option value="서울양양선(서울-춘천)">서울양양선(서울-춘천)</option>
                <option value="서울외곽순환선">서울외곽순환선</option>
            </select>
            <Map center={position} level={zoomLevel} style={mapStyle}>
                {restAreas.map((area, index) => (
                    <MapMarker key={index} position={{lat: area.위도, lng: area.경도}}
                               onClick={() => handleMarkerClick(area)}>
                        <div>{area.휴게소명}</div>
                    </MapMarker>
                ))}
            </Map>
            {selectedRestArea && (
                <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                    <h2>{selectedRestArea.휴게소명}</h2>
                    <p>전화번호: {selectedRestArea.휴게소전화번호}</p>
                    <div style={{position:'relative',bottom:'110px',left:'80px',display:'flex',  justifyContent: 'center' }}>
                    {selectedRestArea.주유소유무 === 'Y' && (
                        <p><img src="/img/fuel_icon.png" alt="주유소"    style={{ width: '45px', height: '45px',marginRight:'5px'}}  /> </p>
                    )}
                    {selectedRestArea.LPG충전소유무 === 'Y' && (
                        <p><img src="/img/lpg_icon.png" alt="LPG 충전소" style={{ width: '45px', height: '45px',marginRight:'5px' }}/></p>
                    )}
                    {selectedRestArea.쉼터유무 === 'Y' && (
                        <p><img src="/img/shelter_icon.png" alt="쉼터" style={{ width: '45px', height: '45px' }} /> </p>
                    )}
                        </div>
                </Modal>
            )}

        </div>
    );
}

export default RestAreaDetail;
