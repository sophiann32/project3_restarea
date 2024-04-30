import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LocationTracker = () => {
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null
    });
    const [stations, setStations] = useState([]);
    const [error, setError] = useState(null);

    const handleSuccess = (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
            latitude,
            longitude
        });
        // 서버에 위치 데이터 전송하고 충전소 정보 받기
        axios.post('http://localhost:5000/location', { latitude, longitude })
            .then(response => {
                console.log('받은데이터:', response.data);
                setStations(response.data.stations);  // 충전소 정보 상태 업데이트
            })
            .catch(error => {
                console.error('에러 :', error);
                setError('충전소 정보 불러올수없음');
            });
    };

    const handleError = (error) => {
        setError(error.message);
    };

    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return (
        <div>
            <h2>현재 위치</h2>
            {error ? (
                <p>오류: {error}</p>
            ) : (
                <p>
                    위도: {location.latitude ? location.latitude.toFixed(3) : "위치 정보 없음"},
                    경도: {location.longitude ? location.longitude.toFixed(3) : "위치 정보 없음"}
                </p>
            )}
            <h2>가까운 충전소</h2>
            {stations.length > 0 ? (
                <ul>
                    {stations.map(station => (
                        <li key={station["Station Name"]}>
                            {station["Station Name"]} - {station.Distance.toFixed(2)} km
                        </li>
                    ))}
                </ul>
            ) : (
                <p>충전소 정보를 불러올 수 없습니다.</p>
            )}
        </div>
    );
};

export default LocationTracker;
