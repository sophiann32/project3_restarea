import React, { useState } from 'react';
import { Map, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import styles from './jejuMap.module.css';

function JejuMap({ spots, selectedSpot, onSelectSpot }) {
    const [mapCenter, setMapCenter] = useState({ lat: 33.36, lng: 126.55 });
    const [showOverlay, setShowOverlay] = useState(false);

    const selectSpot = (spot) => {
        onSelectSpot(spot);
        setMapCenter({ lat: spot.LATITUDE, lng: spot.LONGITUDE });
        setShowOverlay(false);  // Reset overlay visibility when a new spot is selected
    };

    const handleMouseOver = () => {
        console.log("Mouse over: Showing overlay");  // 로깅 추가
        setShowOverlay(true);
    };
    const handleMouseOut = () => {
        console.log("Mouse out: Hiding overlay");  // 로깅 추가
        setShowOverlay(false);
    };

    console.log("Render: showOverlay =", showOverlay);  // 매 렌더링마다 showOverlay 상태 로깅

    return (
        <div id={styles.mainJ2}>
            <div className={styles.mapSpace}>
                <Map
                    center={mapCenter}
                    level={3}  // Adjusted for closer focus
                    style={{ width: "100%", height: "100%" }}
                >
                    {selectedSpot && (
                        <MapMarker
                            position={{ lat: selectedSpot.LATITUDE, lng: selectedSpot.LONGITUDE }}
                            image={{
                                src: '/img/관광지.png',
                                size: { width: 80, height: 80 }
                            }}
                            onMouseOver={handleMouseOver} // 올바른 이벤트 핸들러 이름 사용
                            onMouseOut={handleMouseOut}
                        />

                    )}
                    {showOverlay && selectedSpot && (
                        <CustomOverlayMap
                            position={{ lat: selectedSpot.LATITUDE, lng: selectedSpot.LONGITUDE }}
                            content={renderOverlay(selectedSpot)}
                        />
                    )}
                </Map>
            </div>
            <div className={styles.tourList}>
                {spots.map(spot => (
                    <div key={spot.CONTENTS_ID} className={styles.tourItem} onClick={() => selectSpot(spot)}>
                        <img src={spot.THUMBNAIL_PATH} alt={spot.TITLE} style={{ width: "100px", height: "100px" }} />
                        <h3>{spot.TITLE}</h3>
                        <p>{spot.ROAD_ADDRESS}</p>
                        <p>{spot.PHONE_NO}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function renderOverlay(spot) {
    const tags = spot.TAG ? spot.TAG.split(', ').slice(0, 5) : [];
    return `<div style="padding:5px; background-color:white; border:1px solid black; border-radius:10px; z-index: 1">
        <h4>${spot.TITLE}</h4>
        <p>${spot.ROAD_ADDRESS}</p>
        <p>${spot.PHONE_NO}</p>
        ${tags.map(tag => `<span>${tag}</span>`).join(' ')}
        <p>${spot.INTRODUCTION}</p>
        <img src=${spot.THUMBNAIL_PATH} alt="Image" style="width:100px; height:100px;"/>
    </div>`;
}

export default JejuMap;
