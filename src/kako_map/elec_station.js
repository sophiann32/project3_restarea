// React와 여러 필요한 모듈들을 가져옴
import React, { useState, useEffect } from 'react';
import { Map, MapMarker, CustomOverlayMap, Circle } from "react-kakao-maps-sdk";

import './elec_station.css'

// 날짜 및 시간을 보기 좋게 포맷하는 함수 정의
function formatDateTime(dateTimeStr) {
    // 날짜와 시간 정보를 부분적으로 추출
    const year = dateTimeStr.substring(0, 4);
    const month = dateTimeStr.substring(4, 6);
    const day = dateTimeStr.substring(6, 8);
    const hour = dateTimeStr.substring(8, 10);
    const minute = dateTimeStr.substring(10, 12);
    const second = dateTimeStr.substring(12, 14);

    // 추출된 정보를 기반으로 문자열을 조합하여 반환
    return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분 ${second}초`;
}

// 충전소 정보를 표시하는 팝업 컴포넌트
function ElecStationPopup({ station, onClose }) {
    // 팝업을 표시할 스테이션이 없으면 아무 것도 렌더링하지 않음
    if (!station) return null;

    // 팝업 스타일을 지정
    const popupStyle = {
        position: 'absolute',
        bottom: '150px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px',
        height: '200px',
        padding: '15px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#fff',
        fontSize: '12px',
        textAlign: 'center',
        zIndex: 100,
    };

    // 킬로미터 값을 소수점 둘째자리까지 포맷
    function ToTwoDecimal(kilometers) {
        return kilometers.toFixed(2);
    }

    // 팝업에 표시될 날짜를 포맷
    const formattedDate = formatDateTime(station.lastUpdated);
    // 거리 정보를 포맷
    const distanceKm = ToTwoDecimal(station.distance);

    // 팝업 컴포넌트의 JSX를 반환
    return (
        <div style={popupStyle}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                <span style={{fontWeight: 'bold', margin: '0px 60px', fontSize: '20px'}}>{station.stationName}</span>
            </div>
            <div style={{marginTop: '20px'}}>
                <p><strong>주소:</strong> {station.address}</p>
                <p><strong>총 충전기 수:</strong> {station.total}</p>
                <p><strong>충전 가능:</strong> {station.available}</p>
                <p><strong>상태 갱신 일시:</strong> {formattedDate}</p>
                <p><strong>거리:</strong> {distanceKm}km</p>
            </div>
            <button onClick={onClose} style={{
                width:'100px',
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

// 반경에 따른 지도의 줌 레벨을 결정하는 함수
function getZoomLevel(radius) {
    switch (parseInt(radius, 10)) {
        case 1: return 4;
        case 3: return 6;
        case 5: return 7;
        default: return 3;
    }
}

function getZoomLevelForMobile(radius) {
    switch (parseInt(radius, 10)) {
        case 1: return 5;
        case 3: return 7;
        case 5: return 8;
        default: return 5;
    }
}

// 전기차 충전소 위치를 지도에 표시하는 컴포넌트
function Elec_station({ locations, radius }) {
    const [state, setState] = useState({
        center: { lat: 37.5665, lng: 126.9780 },
        zoomLevel: getZoomLevel(radius),
        selectedStation: null,
        chargersInfo: {},
        userLocation: null,
        radius: radius,
        isLoading: false,
    });

    useEffect(() => {
        setState(prev => ({ ...prev, isLoading: true }));
        const chargersInfo = locations.reduce((acc, station) => {
            if (!acc[station.statId]) {
                acc[station.statId] = {
                    total: 0,
                    available: 0,
                    stationName: station.statNm,
                    address: station.addr,
                    lastUpdated: station.statUpdDt,
                    distance: station.distance
                };
            }
            acc[station.statId].total += 1;
            if (station.stat === "2") {
                acc[station.statId].available += 1;
            }
            return acc;
        }, {});

        setState(prev => ({ ...prev, chargersInfo, isLoading: false }));
    }, [locations]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setState(prev => ({
                    ...prev,
                    userLocation: { lat: latitude, lng: longitude },
                    center: { lat: latitude, lng: longitude }
                }));
            },
            (error) => {
                console.error("Geolocation error:", error);
            },
            { enableHighAccuracy: true }
        );
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.matchMedia("(max-width: 480px)").matches;
            const zoomLevel = isMobile ? getZoomLevelForMobile(radius) : getZoomLevel(radius);
            setState(prev => ({
                ...prev,
                zoomLevel,
                radius: radius * 1000
            }));
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, [radius]);

    const onMarkerClick = (statId) => {
        setState(prev => ({
            ...prev,
            selectedStation: prev.chargersInfo[statId]
        }));
    };

    const closeInfoWindow = () => {
        setState(prev => ({
            ...prev,
            selectedStation: null
        }));
    };

    const loadingOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '24px',
        zIndex: 1000
    };

    return (
        <>
            {state.isLoading && (
                <div style={loadingOverlayStyle}>
                    불러오는 중...
                </div>
            )}
            <div className="mapContainer">
                <Map center={state.center} style={{ width: "100%", height: "100%" }} level={state.zoomLevel}>
                    {state.userLocation && (
                        <>
                            <MapMarker
                                position={state.userLocation}
                                image={{ src: '/img/my_location.png', size: { width: 24, height: 35 } }}
                            />
                            <CustomOverlayMap position={state.userLocation} yAnchor={2.0}>
                                <div style={{ padding: '5px', borderRadius: '1px', height: '20px', fontWeight: 'bold' }}>
                                    내 위치
                                </div>
                            </CustomOverlayMap>
                            <Circle
                                center={state.userLocation}
                                radius={state.radius}
                                strokeWeight={2}
                                strokeColor={'#75B8FA'}
                                strokeOpacity={0.7}
                                fillColor={'#e5effc'}
                                fillOpacity={0.5}
                            />
                        </>
                    )}
                    {locations.map((station) => (
                        <React.Fragment key={`${station.statId}-${station.chgerId}`}>
                            <MapMarker
                                position={{ lat: parseFloat(station.lat), lng: parseFloat(station.lng) }}
                                image={{
                                    className: station.stat === "2" ? 'pulsemarker' : '',
                                    src: station.stat === "2" ? '/img/live.png' : '/img/elc.png',
                                    size: { width: 24, height: 35 }
                                }}
                                onClick={() => onMarkerClick(station.statId)}
                            />
                        </React.Fragment>
                    ))}
                    {state.selectedStation && (
                        <ElecStationPopup station={state.selectedStation} onClose={closeInfoWindow} />
                    )}
                </Map>
            </div>
        </>
    );
}

export default Elec_station;
