import React, { useState, useEffect } from 'react';
import { Map, MapMarker, CustomOverlayMap, Circle } from "react-kakao-maps-sdk";

function formatDateTime(dateTimeStr) {
    const year = dateTimeStr.substring(0, 4);
    const month = dateTimeStr.substring(4, 6);
    const day = dateTimeStr.substring(6, 8);
    const hour = dateTimeStr.substring(8, 10);
    const minute = dateTimeStr.substring(10, 12);
    const second = dateTimeStr.substring(12, 14);

    return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분 ${second}초`;
}

function ElecStationPopup({ station, onClose }) {
    if (!station) return null;

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

    function ToTwoDecimal(kiometers) {
        return kiometers.toFixed(2); //
    }


    const formattedDate = formatDateTime(station.lastUpdated);
    // 거리 정보를 포맷팅합니다. 예를 들어, meters 단위를 kilometers로 변환할 수 있습니다.
    const distanceKm = ToTwoDecimal(station.distance);

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
                <p><strong>거리:</strong> {distanceKm}km</p> {/* 거리 정보 추가 */}
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

function getZoomLevel(radius) {
    switch (parseInt(radius, 10)) {
        case 1: return 4;
        case 3: return 6;
        case 5: return 7;
        default: return 3;
    }
}

function Elec_station({ locations, radius }) {
    const [state, setState] = useState({
        center: { lat: 37.5665, lng: 126.9780 },
        zoomLevel: getZoomLevel(radius),
        selectedStation: null,
        chargersInfo: {},
        userLocation: null,
        radius: radius // 반경 상태 추가
    });

    useEffect(() => {
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

        setState(prev => ({
            ...prev,
            chargersInfo
        }));
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
        setState(prev => ({
            ...prev,
            zoomLevel: getZoomLevel(radius),
            radius: radius * 1000 // radius 값을 미터로 변환하여 저장
        }));
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

    return (
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
                            src: station.stat === "2" ? '/img/live.png' : '/img/elc.png', // 충전 가능 시 초록색 마커
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
    );
}

export default Elec_station;
