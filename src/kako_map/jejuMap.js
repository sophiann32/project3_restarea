import React, { useState, useRef } from 'react';
import { Map, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import styles from './jejuMap.module.css';

function JejuMap({ spots, filteredSpots, selectedSpot, onSelectSpot, categories, onCategoryChange }) {
    const [mapCenter, setMapCenter] = useState({ lat: 33.36, lng: 126.55 });
    const [hoveredSpot, setHoveredSpot] = useState(null);
    const hoverTimeoutRef = useRef(null);

    const selectSpot = (spot) => {
        onSelectSpot(spot);
        setMapCenter({ lat: spot.LATITUDE, lng: spot.LONGITUDE });
        setHoveredSpot(null);  // Reset overlay visibility when a new spot is selected
    };

    const handleMouseOver = (spot) => {
        clearTimeout(hoverTimeoutRef.current);
        setHoveredSpot(spot);
    };

    const handleMouseOut = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setHoveredSpot(null);
        }, 300);  // Adjust delay as needed
    };

    return (
        <div id={styles.mainJ2}>
            <div className={styles.mapSpace}>
                <Map
                    center={{ lat: selectedSpot?.LATITUDE || 33.32, lng: selectedSpot?.LONGITUDE || 126.55 }}
                    level={9}
                    style={{ width: "100%", height: "100%" }}
                >
                    {filteredSpots.map(spot => (
                        <React.Fragment key={spot.CONTENTS_ID}>
                            <MapMarker
                                position={{ lat: spot.LATITUDE, lng: spot.LONGITUDE }}
                                onClick={() => selectSpot(spot)}
                                onMouseOver={() => handleMouseOver(spot)}
                                onMouseOut={handleMouseOut}
                                image={{
                                    src: '/img/관광지.png',
                                    size: { width: 50, height: 50 }
                                }}
                            />
                            {hoveredSpot === spot && (
                                <CustomOverlayMap
                                    position={{ lat: spot.LATITUDE, lng: spot.LONGITUDE }}
                                    yAnchor={1}
                                >
                                    <div className={styles.overlayWrapSmall}>
                                        <img src={spot.THUMBNAIL_PATH} alt="thumbnail" className={styles.overlayImageSmall} />
                                        <h4 className={styles.overlayTitleSmall}>{spot.TITLE}</h4>
                                        <p className={styles.overlayAddressSmall}>{spot.ROAD_ADDRESS}</p>
                                        <p className={styles.overlayPhoneSmall}>{spot.PHONE_NO}</p>
                                        <p className={styles.overlayIntroductionSmall}>{spot.INTRODUCTION}</p>
                                    </div>
                                </CustomOverlayMap>
                            )}
                        </React.Fragment>
                    ))}
                </Map>
            </div>
            <div className={styles.categoryButtons}>
                {Object.keys(categories).map(category => (
                    <button
                        key={category}
                        className={styles.categoryButton}
                        onClick={() => onCategoryChange(categories[category].tags)}
                        style={{ backgroundImage: `url(${categories[category].imageUrl})` }}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default JejuMap;
