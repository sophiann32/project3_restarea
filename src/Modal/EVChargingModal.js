import React, { useState, useEffect } from 'react';
import { Map, MapMarker, CustomOverlayMap, Circle } from "react-kakao-maps-sdk";
import styles from './evChargingModal.module.css';
import axios from 'axios';

function EVChargingModal({ onClose }) {
    const [radius, setRadius] = useState(5); // 기본 반경 설정
    const [chargingStations, setChargingStations] = useState([]);
    const [center, setCenter] = useState({ lat: 33.499621, lng: 126.531188 }); // 디폴트 중심 설정
    const [selectedStation, setSelectedStation] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(3); // 지도의 줌 레벨 설정
    const [userLocation, setUserLocation] = useState(null); // 사용자의 현재 위치 설정

    useEffect(() => {
        // 사용자의 현재 위치 가져오기
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // 제주도 범위 확인
                if (latitude >= 33.0 && latitude <= 34.0 && longitude >= 126.0 && longitude <= 127.0) {
                    setUserLocation({ lat: latitude, lng: longitude });
                    setCenter({ lat: latitude, lng: longitude });
                    fetchChargingStations(latitude, longitude, radius);
                } else {
                    setUserLocation({ lat: 33.499621, lng: 126.531188 });
                    setCenter({ lat: 33.499621, lng: 126.531188 });
                    fetchChargingStations(33.499621, 126.531188, radius);
                }
            },
            (error) => {
                console.error("현재 위치를 가져오는 도중 오류가 발생했습니다:", error);
                setUserLocation({ lat: 33.499621, lng: 126.531188 });
                setCenter({ lat: 33.499621, lng: 126.531188 });
                fetchChargingStations(33.499621, 126.531188, radius);
            }
        );
    }, [radius]);

    useEffect(() => {
        // 반경에 따라 줌 레벨 설정
        switch (radius) {
            case 1:
                setZoomLevel(5);
                break;
            case 3:
                setZoomLevel(6);
                break;
            case 5:
                setZoomLevel(7);
                break;
            default:
                setZoomLevel(5);
        }
    }, [radius]);

    const fetchChargingStations = (latitude, longitude, radius) => {
        axios
            .get('http://localhost:5000/api/charging-stations-jeju', {
                params: {
                    latitude: latitude,
                    longitude: longitude,
                    radius: radius
                }
            })
            .then(response => {
                setChargingStations(response.data);
            })
            .catch(error => {
                console.error('충전소 정보를 가져오는 도중 오류가 발생했습니다:', error);
            });
    };

    const handleMarkerMouseOver = (station) => {
        setSelectedStation(station);
    };

    const handleMarkerMouseOut = () => {
        setSelectedStation(null);
    };

    const handleSortByDistance = () => {
        const sortedStations = [...chargingStations].sort((a, b) => a.Distance - b.Distance);
        setChargingStations(sortedStations);
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <div className={styles.header}>
                    <button className={styles.closeButton} onClick={onClose}>닫기</button>
                </div>
                <div className={styles.body}>
                    <div className={styles.mapSection}>
                        <Map
                            center={center}
                            level={zoomLevel}
                            style={{ width: "100%", height: "100%" }}
                        >
                            {userLocation && (
                                <>
                                    <MapMarker
                                        position={userLocation}
                                        image={{
                                            src: "/img/car.png", // 사용자 위치 이미지
                                            size: {
                                                width: 50,
                                                height: 50,
                                            },
                                        }}
                                        className={styles.userLocationMarker}
                                    />
                                    <CustomOverlayMap
                                        position={userLocation}
                                        yAnchor={2.3}
                                    >
                                        <div className={styles.userLocationText}>
                                            현재 위치
                                        </div>
                                    </CustomOverlayMap>
                                </>
                            )}
                            <Circle
                                center={center}
                                radius={radius * 1000} // 반경 km를 미터로 변환
                                strokeWeight={2}
                                strokeColor={"#004c80"}
                                strokeOpacity={0.8}
                                strokeStyle={"solid"}
                                fillColor={"#fff"}
                                fillOpacity={0.7}
                            />
                            {chargingStations.map((station, index) => (
                                <MapMarker
                                    key={index}
                                    position={{ lat: station.lat, lng: station.lng }}
                                    title={station.Name}
                                    image={{
                                        src: "/img/jeju_elc.png", // 충전소 이미지
                                        size: {
                                            width: 36,
                                            height: 36,
                                        },
                                    }}
                                    onMouseOver={() => handleMarkerMouseOver(station)}
                                    onMouseOut={handleMarkerMouseOut}
                                    className={styles.chargingStationMarker}
                                />
                            ))}
                            {selectedStation && (
                                <CustomOverlayMap
                                    position={{ lat: selectedStation.lat, lng: selectedStation.lng }}
                                    yAnchor={1.2}
                                >
                                    <div className={styles.overlayWrapSmall}>
                                        <h4 className={styles.overlayTitleSmall}>{selectedStation.Name}</h4>
                                        <div className={styles.overlayInfoSmall}>
                                            <p><strong>주소:</strong> {selectedStation.Address}</p>
                                            <p><strong>이용 시간:</strong> {selectedStation["Usage Time"]}</p>
                                            <p><strong>거리:</strong> {selectedStation.Distance.toFixed(2)} km</p>
                                            <p><strong>급속 충전기:</strong> {selectedStation["Fast Chargers"]}</p>
                                            <p><strong>완속 충전기:</strong> {selectedStation["Slow Chargers"]}</p>
                                        </div>
                                    </div>
                                </CustomOverlayMap>
                            )}
                        </Map>
                    </div>
                    <div className={styles.infoSection}>
                        <h2>전기차 충전소</h2>
                        <label>
                            반경 선택:
                            <select value={radius} onChange={(e) => setRadius(Number(e.target.value))}>
                                <option value={1}>1km</option>
                                <option value={3}>3km</option>
                                <option value={5}>5km</option>
                            </select>
                        </label>
                        <button className={styles.sortButton} onClick={handleSortByDistance}>거리순 정렬</button>
                        <ul className={styles.stationList}>
                            {chargingStations.map((station, index) => (
                                <li key={index} className={styles.stationItem}>
                                    <div className={styles.stationInfo}>
                                        <h3>{station.Name}</h3>
                                        <p><strong>주소:</strong> {station.Address}</p>
                                        <p><strong>이용 시간:</strong> {station["Usage Time"]}</p>
                                        <p><strong>거리:</strong> {station.Distance.toFixed(2)} km</p>
                                        <p><strong>급속 충전기:</strong> {station["Fast Chargers"]}</p>
                                        <p><strong>완속 충전기:</strong> {station["Slow Chargers"]}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EVChargingModal;
