// JejuMap.js
import React from 'react';
import { Map, MapMarker } from "react-kakao-maps-sdk";
import styles from './jejuMap.module.css';

function JejuMap({ spots, selectedSpot, onSelectSpot }) {
    return (
        <div id={styles.mainJ2}>
            <div className={styles.mapSpace}>
                <Map
                    center={{ lat: selectedSpot ? selectedSpot.LATITUDE : 33.36, lng: selectedSpot ? selectedSpot.LONGITUDE : 126.55 }}
                    level={9}
                    style={{ width: "100%", height: "100%" }}
                >
                    {selectedSpot && (
                        <MapMarker position={{ lat: selectedSpot.LATITUDE, lng: selectedSpot.LONGITUDE }}>
                            {selectedSpot.TITLE}
                        </MapMarker>
                    )}
                </Map>
            </div>
            <div className={styles.tourList}>
                {spots.map(spot => (
                    <div key={spot.CONTENTS_ID} className={styles.tourItem} onClick={() => onSelectSpot(spot)}>
                        <img src={spot.THUMBNAIL_PATH} alt={spot.TITLE} style={{width: "100px", height: "100px"}}/>
                        <h3>{spot.TITLE}</h3>
                        <p>{spot.ROAD_ADDRESS}</p>
                        <p>{spot.PHONE_NO}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default JejuMap;
