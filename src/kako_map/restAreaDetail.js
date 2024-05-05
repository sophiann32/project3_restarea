import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Map, MapMarker, } from "react-kakao-maps-sdk";
import Modal from '../Modal/Modal';
import styles from './restAreaDetail.module.css'


function RestAreaDetail({ selectedRoute }) {
    const [position, setPosition] = useState({ lat: 36.5, lng: 127.5 });
    const [zoomLevel, setZoomLevel] = useState(12);
    const [restAreas, setRestAreas] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRestArea, setSelectedRestArea] = useState(null);

///////// hover 용 ////////
    const [isOpen, setIsOpen] = useState(false)
///////// hover 용 ////////

    useEffect(() => {
        if (selectedRoute) {
            axios.get(`http://localhost:5000/restareas?route=${selectedRoute}`)
                .then(response => {
                    setRestAreas(response.data);
                    if (response.data.length > 0) {
                        const firstArea = response.data[0];
                        setPosition({ lat: firstArea.위도, lng: firstArea.경도 });
                    }
                })
                .catch(error => console.error('Error fetching data: ', error));
            setZoomLevel(12); // 줌 레벨 설정
        }
    }, [selectedRoute]); // selectedRoute 변경 시 업데이트

    const handleMarkerClick = area => {
        setSelectedRestArea(area);
        setModalOpen(true);
    };

    return (
        <div>
            <Map center={position} level={zoomLevel} style={{ width: "100%", height: "900px" }}>
                {restAreas.map((area, index) => (
                    <MapMarker  key={index} position={{ lat: area.위도, lng: area.경도 }}
                               onClick={() => handleMarkerClick(area)}
                               onMouseOver={() => setIsOpen(area)}
                               onMouseOut={() => setIsOpen(null)}
                               image={{
                                   src: "https://images.emojiterra.com/google/noto-emoji/unicode-15.1/color/512px/1f53b.png", // red ▼
                                   size: {
                                       width: 30,
                                       height: 35,
                                   }
                               }}>
                        {isOpen === area && <div style={{fontSize: 17, color: '#000000', backgroundColor: '#fffefe', padding: '5px', borderRadius: '5px', textAlign: 'center' }}>{area.휴게소명}</div>}
                    </MapMarker>
                ))}
            </Map>
            {selectedRestArea && (
                <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                    <h2>{selectedRestArea.휴게소명}</h2>
                    <p>전화번호: {selectedRestArea.휴게소전화번호}</p>
                    {/* Additional info */}
                </Modal>
            )}
        </div>
    );
}

export default RestAreaDetail;
