import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Map, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";

function Elec_station() {
    const [state, setState] = useState({
        center: { lat: 33.450701, lng: 126.570667 },
        matchingChargerData: [],
        locations: [],
        errMsg: null,
        isLoading: true,
        showOverlayId: null
    });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newPos = { lat: position.coords.latitude, lng: position.coords.longitude };
                    setState(prev => ({ ...prev, center: newPos, isLoading: false }));
                    fetchStations(newPos.lat, newPos.lng);
                },
                (err) => {
                    setState(prev => ({ ...prev, errMsg: err.message, isLoading: false }));
                }
            );
        } else {
            setState(prev => ({ ...prev, errMsg: "Geolocation을 사용할 수 없어요.", isLoading: false }));
        }
    }, []);

    const fetchStations = (latitude, longitude) => {
        axios.post('http://localhost:5000/find-stations', { latitude, longitude })
            .then(response => {
                const { dbData, matchingChargerData } = response.data;
                setState(prev => ({
                    ...prev,
                    locations: dbData,
                    matchingChargerData: matchingChargerData,
                    isLoading: false
                }));
            })
            .catch(error => {
                setState(prev => ({ ...prev, errMsg: '충전소 정보를 가져오는데 실패했습니다.', isLoading: false }));
            });
    };

    const getMarkerImage = (stat, isMatched) => {
        if (isMatched) {
            return '/img/matched_marker.png';
        }
        switch (stat) {
            case '2': return '/img/green_marker.png';
            case '3': return '/img/orange_marker.png';
            default: return '/img/default_elec.png';
        }
    };

    const toggleOverlay = (statId) => {
        setState(prev => ({
            ...prev,
            showOverlayId: prev.showOverlayId === statId ? null : statId
        }));
    };

    const getChargerStatusMessage = (stat) => {
        switch (stat) {
            case '1': return '통신 이상';
            case '2': return '충전 가능';
            case '3': return '충전 중';
            case '4': return '운영 중지';
            case '5': return '점검 중';
            case '9': return '상태 미확인';
            default: return '정보 없음';
        }
    };

    return (
        <Map center={state.center} style={{ width: "100%", height: "100%" }} level={3}>
            {!state.isLoading && (
                <MapMarker position={state.center} image={{ src: '/img/current_location.png', size: { width: 40, height: 40 } }}>
                    <div style={{ padding: "5px", color: "#000" }}>
                        {state.errMsg ? state.errMsg : "현재 위치"}
                    </div>
                </MapMarker>
            )}
            {state.locations.map(loc => {
                const isMatched = state.matchingChargerData.some(charger => charger.statId === loc.statId);
                return (
                    <React.Fragment key={loc.statId}>
                        <MapMarker
                            position={{ lat: loc.lat, lng: loc.lng }}
                            image={{
                                src: getMarkerImage(loc.stat, isMatched),
                                size: { width: 40, height: 40 }
                            }}
                            onClick={() => toggleOverlay(loc.statId)}
                        />
                        {state.showOverlayId === loc.statId && (
                            <CustomOverlayMap position={{ lat: loc.lat, lng: loc.lng }}>
                                <div style={{
                                    padding: "15px",
                                    background: "rgba(255, 255, 255, 0.9)",
                                    border: "1px solid #ddd",
                                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                                    borderRadius: "10px",
                                    fontSize: "13px",
                                    maxWidth: "300px",
                                    lineHeight: "1.4",
                                    fontFamily: "'Noto Sans KR', sans-serif"
                                }}>
                                    <button onClick={() => toggleOverlay(null)} style={{
                                        position: "absolute",
                                        top: "10px",
                                        right: "10px",
                                        cursor: "pointer",
                                        border: "none",
                                        background: "#fff",
                                        borderRadius: "50%",
                                        width: "24px",
                                        height: "24px",
                                        lineHeight: "24px",
                                        textAlign: "center",
                                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                        color: "#333"
                                    }}>&times;</button>
                                    <strong>{loc.statNm}</strong><br />
                                    {loc.addr}<br />
                                    <span>상태: {getChargerStatusMessage(loc.stat)}</span><br />
                                    <span>Distance: {loc.distance.toFixed(2)} km</span>
                                </div>
                            </CustomOverlayMap>
                        )}
                    </React.Fragment>
                );
            })}
        </Map>
    );
}

export default Elec_station;
