
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Map, MapMarker, CustomOverlayMap,Circle  } from "react-kakao-maps-sdk";
import {isVisible} from "@testing-library/user-event/dist/utils";
import styles from '../kako_map/gas_staion.module.css'


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

    // 팝업 내용 반환
    return (
        <div style={popupStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold', marginTop: '15px', fontSize: '20px', marginLeft: '50px' }}>{station.name}</span>
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
                width: '100px',
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
// 사용자 위치 팝업창 컴포넌트
function UserLocationPopup({ center }) {
    const popupStyle = {
        padding: '5px',
        borderRadius: '1px',
        height: '20px',
    };

    // 사용자 위치에 팝업창 표시
    return (
        <CustomOverlayMap
            position={center}
            yAnchor={2.5} // 팝업창을 마커 하단에 위치시킴
        >
            <div style={popupStyle}>
                <h4>내 위치</h4>
            </div>
        </CustomOverlayMap>
    );
}

// 줌 레벨 설정 함수
function getZoomLevel(radius) {
    switch (parseInt(radius, 10)) {
        case 1: return 6;
        case 3: return 8;
        case 5: return 8;
        default: return 6;
    }
}


// 모바일 줌 레벨 설정 함수
function getZoomLevelForMobile(radius) {
    switch (parseInt(radius, 10)) {
        case 1: return 4;
        case 3: return 7;
        case 5: return 8;
        default: return 5;
    }
}

// 주유소 정보를 지도에 표시하는 컴포넌트
function GasStation({ radius, stations }) {
    const [state, setState] = useState({
        center: { lat: 33.450701, lng: 126.570667 },
        zoomLevel: getZoomLevel(radius),
        errMsg: null,
        isLoading: true,
        selectedStation: null,
        isVisible: true  // isVisible 상태 추가
    });

    // 위치 정보 업데이트 함수
    const updateLocation = () => {
        setState(prev => ({ ...prev, isLoading: true })); // 로딩 상태 활성화
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setState(prev => ({
                ...prev,
                center: { lat: latitude, lng: longitude },
                isLoading: false
            }));
        }, err => {
            setState(prev => ({ ...prev, errMsg: err.message, isLoading: false }));
        }, {
            enableHighAccuracy: true
        });
    };

    // 뷰포트 크기 변경에 따라 줌 레벨 조정
    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.matchMedia("(max-width: 480px)").matches;
            const zoomLevel = isMobile ? getZoomLevelForMobile(radius) : getZoomLevel(radius);
            setState(prev => ({ ...prev, zoomLevel }));
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // 초기 실행

        return () => window.removeEventListener("resize", handleResize);
    }, [radius]);


    useEffect(() => {
        updateLocation();
    }, []);





    useEffect(() => {
        const newZoomLevel = getZoomLevel(radius);
        console.log('변경되는 줌 레벨:', newZoomLevel);
        setState(prev => ({
            ...prev,
            zoomLevel: newZoomLevel
        }));
    }, [radius]);

    // 정보창 닫기 함수
    const closeInfoWindow = () => {
        setState(prev => ({ ...prev, selectedStation: null }));
    };

    // 마커 클릭 이벤트 핸들러
    const onMarkerClick = (station) => {
        setState(prev => ({ ...prev, selectedStation: station }));
    };

    // 반경 내의 주유소만 필터링
    const filteredStations = stations.filter(station => station.distance <= radius * 1000);


    return (
        <div className={styles.mapContainer}>
            <Map center={state.center} style={{ width: "100%", height: "100%" }}
                 level={state.zoomLevel}
                 key={state.zoomLevel}>
                <Circle
                    center={state.center}
                    radius={parseInt(radius) * 1000} // km to meters
                    strokeWeight={2} // 선의 두께
                    strokeColor={'#75B8FA'} // 선의 색깔
                    strokeOpacity={state.isVisible ? 0.7 : 0} // 선의 불투명도
                    fillColor={'#e5effc'} // 채우기 색깔
                    fillOpacity={state.isVisible ? 0.5 : 0} // 채우기 불투명도
                />
                <MapMarker position={state.center}
                           image={{
                               src:"img/my_location.png", // 사용자 위치를 나타내는 아이콘
                               size: {width: 24, height: 35},
                               options: { className: 'marker-animation' } // 애니메이션 클래스 적용
                           }}
                />
                <UserLocationPopup center={state.center} />
                {!state.isLoading && filteredStations.map(station => {
                    console.log("마커 위치:", station.latitude, station.longitude); // 로그 추가
                    return (
                        <MapMarker
                            key={station.name}
                            position={{ lat: station.latitude, lng: station.longitude }}
                            image={{
                                src: "img/fuel.png", // 실제 마커 이미지 경로로 대체
                                size: { width: 24, height: 35 },
                            }}
                            onClick={() => onMarkerClick(station)}
                        />
                    );
                })}

            </Map>
            {state.selectedStation && (
                <Popup station={state.selectedStation} onClose={closeInfoWindow} />
            )}
        </div>
    );
}

export default GasStation;