import React, { useState, useEffect } from 'react';
import { Map, MapMarker } from "react-kakao-maps-sdk";

function RestAreaDetail() {
    // 맵의 중심 좌표 및 줌 레벨 상태를 관리합니다.
    const [position, setPosition] = useState({ lat: 36.5, lng: 127.5 }); // 중심 좌표를 조금 더 중앙으로 조정
    const [zoomLevel, setZoomLevel] = useState(12); // 줌 레벨을 한반도 전체가 보이게 조정

    // CSS로 맵 컴포넌트를 화면 전체에 표시
    const mapStyle = {
        width: "100%",  // 화면 전체 너비
        height: "900px", // 화면 전체 높이
    };

    return (
        <Map // 카카오 맵 컴포넌트
            center={position} // 맵 중심 좌표
            level={zoomLevel} // 줌 레벨
            style={mapStyle} // 맵의 크기 및 위치
        >
            <MapMarker // 마커 컴포넌트
                position={position} // 마커 위치
                onClick={() => alert('여기는 한국의 중심입니다!')} // 마커 클릭 시 이벤트
            >
                <div style={{ color: "#000" }}>서울특별시</div>
            </MapMarker>
        </Map>
    );
}

export default RestAreaDetail;
