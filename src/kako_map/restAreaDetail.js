import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Map, MapMarker } from "react-kakao-maps-sdk";
import Modal from '../Modal/Modal';

// function Modal({ isOpen, onClose, children }) {
//     if (!isOpen) return null;
//
//     return (
//         <div style={{
//             position: 'fixed',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             backgroundColor: 'white',
//             padding: '20px',
//             zIndex: 1000,
//             borderRadius: '8px',
//             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//             width: '300px'
//         }}>
//             <button onClick={onClose} style={{
//                 position: 'absolute',
//                 right: '130px',
//                 top: '180px',
//                 width: '80px',
//                 borderRadius: '5px',
//                 fontSize: '24px',
//                 cursor: 'pointer',
//             }}>
//
//             </button>
//             {children}
//         </div>
//     );
// }
//
function RestAreaDetail({ selectedRoute }) {
    const [position, setPosition] = useState({ lat: 36.5, lng: 127.5 });
    const [zoomLevel, setZoomLevel] = useState(12);
    const [restAreas, setRestAreas] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRestArea, setSelectedRestArea] = useState(null);

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
                    <MapMarker key={index} position={{ lat: area.위도, lng: area.경도 }}
                               onClick={() => handleMarkerClick(area)}>
                        <div>{area.휴게소명}</div>
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
