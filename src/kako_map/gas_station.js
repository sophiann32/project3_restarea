
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Map, MapMarker, MapInfoWindow } from "react-kakao-maps-sdk";



function Popup({ station, onClose }) {
    if (!station) return null; // 선택된 주유소가 없다면 팝업을 렌더링하지 않음

    // 팝업창 위치와 크기 설정
    const popupStyle = {
        position: 'absolute',
        bottom: '150px', // 마커 위치에 따라 조절 필요
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px',
        height:'200px',
        padding: '15px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#fff',
        fontSize: '12px',
        textAlign: 'center',
        zIndex: 100,
    };

    return (
        <div style={popupStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold',marginTop:'15px',fontSize:'20px',marginLeft:'50px' }}>{station.name}</span>
                <img
                    src={`img/brand-icons/${station.brand}.png`}
                    alt={station.brand}
                    style={{ width: '50px', height: '50px' }}
                />
            </div>
            <div style={{ margin: '10px 0' }}>
                <p><strong>가격:</strong> {station.price}원</p>
                <p><strong>거리:</strong> {station.distance}m</p>
            </div>
            <button onClick={onClose} style={{
                cursor: 'pointer',
                backgroundColor: '#f00',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                padding: '5px 10px',
                margin: '5px 0'
            }}>
                닫기
            </button>
        </div>
    );
}
// =================================================================================================================


function GasStation({ radius, stations }) {
    const [state, setState] = useState({
        center: { lat: 33.450701, lng: 126.570667 },
        errMsg: null,
        isLoading: true,
        selectedStation: null,
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setState(prev => ({
                ...prev,
                center: { lat: latitude, lng: longitude },
                isLoading: false
            }));
        }, (err) => {
            setState(prev => ({ ...prev, errMsg: err.message, isLoading: false }));
        });
    }, []);

    // 지도상에서 주유소 마커를 클릭했을 때 호출될 함수
    const onMarkerClick = (station) => {
        setState(prev => ({ ...prev, selectedStation: station }));
    };

    // 팝업을 닫는 함수
    const closeInfoWindow = () => {
        setState(prev => ({ ...prev, selectedStation: null }));
    };

    // radius와 stations props를 기반으로 지도에 표시할 주유소를 필터링합니다.
    const filteredStations = stations.filter(station => station.distance <= radius);

    return (
        <div style={{ width: "100%", height: "100%", position: 'relative' }}>
            <Map center={state.center} style={{ width: "100%", height: "100%" }} level={3}>
                {!state.isLoading && filteredStations.map(station => (
                    <MapMarker
                        key={station.name}
                        position={{ lat: station.latitude, lng: station.longitude }}
                        image={{
                            src: "img/fuel.png", // 실제 마커 이미지 경로로 대체
                            size: { width: 24, height: 35 },
                        }}
                        onClick={() => onMarkerClick(station)}
                    />
                ))}
                {/* ... 팝업 관련 로직은 상황에 따라 적용 */}
            </Map>
            {/* selectedStation이 있는 경우에만 Popup을 렌더링합니다. */}
            {state.selectedStation && (
                <Popup station={state.selectedStation} onClose={closeInfoWindow} />
            )}
        </div>
    );
}

export default GasStation;
