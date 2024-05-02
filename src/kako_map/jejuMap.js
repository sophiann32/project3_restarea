import React, { useState, useEffect } from 'react';
import { Map, MapMarker } from "react-kakao-maps-sdk";

function JejuMap() { // 컴포넌트 이름을 대문자로 변경
    const [position, setPosition] = useState({ lat:33.36, lng: 126.55});
    const [zoomLevel, setZoomLevel] = useState(9);
    // const [state, setState] = useState(
    //
    //     {
    //     center: {
    //         lat:33.4998,
    //         lng:126.5312,
    //
    //     },
    //     errMsg: null,
    //     isLoading: true,
    // })

    // useEffect(() => {
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(
    //             (position) => {
    //                 console.log("현재 위치의 위도:", position.coords.latitude);
    //                 console.log("현재 위치의 경도:", position.coords.longitude);
    //                 setState((prev) => ({
    //                     ...prev,
    //                     center: {
    //                         lat: position.coords.latitude,
    //                         lng: position.coords.longitude,
    //                     },
    //                     isLoading: false,
    //                 }))
    //             },
    //             (err) => {
    //                 setState((prev) => ({
    //                     ...prev,
    //                     errMsg: err.message,
    //                     isLoading: false,
    //                 }))
    //             }
    //         )
    //     } else {
    //         setState((prev) => ({
    //             ...prev,
    //             errMsg: "geolocation을 사용할수 없어요..",
    //             isLoading: false,
    //         }))
    //     }
    // }, [])

    return (
        <>
            <Map center={position} level={zoomLevel} style={{ width: "100%", height: "900px" }}>
            </Map>
        </>
    )
}

export default JejuMap; // 컴포넌트 이름을 대문자로 변경
