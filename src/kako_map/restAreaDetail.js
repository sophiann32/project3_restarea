import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Map, MapMarker, } from "react-kakao-maps-sdk";
import Modal from '../Modal/Modal';
import styles from './restAreaDetail.module.css'
import RestAreaModalContent from '../kako_map/RestAreaModalContent';


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


                    <MapMarker key={index} position={{ lat: area.위도, lng: area.경도 }}
                               onClick={() => handleMarkerClick(area)}
                               image={{
                                   // src: "https://images.emojiterra.com/google/noto-emoji/unicode-15.1/color/512px/1f538.png", // orange diamond
                                   // src: "https://images.emojiterra.com/google/noto-emoji/unicode-15.1/color/512px/1f53b.png", // red ▼
                                   // src: "https://images.emojiterra.com/openmoji/v15.0/512px/1f33c.png", // y flower
                                   // src: "https://images.emojiterra.com/google/noto-emoji/unicode-15/animated/2705.gif", // moving green checkbox
                                   // src: "https://images.emojiterra.com/openmoji/v15.0/512px/1f698.png", // oil charge
                                   // src: "https://images.emojiterra.com/openmoji/v15.0/512px/1f697.png ", // r car
                                   // src:"https://images.emojiterra.com/google/noto-emoji/unicode-15.1/color/512px/26fd.png", // r 주유소
                                   src:"https://images.emojiterra.com/google/noto-emoji/unicode-15/animated/2728.gif", // shining star

                                   size: {
                                       width: 25,
                                       height: 25,
                                   }, // 마커이미지의 크기입니다
                                   options: {
                                       offset: {
                                           x: 27,
                                           y: 69,
                                       }, // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
                                   },
                               }}>
                        <div className={styles.marker}>{area.휴게소명}</div>


                    </MapMarker>







                ))}
            </Map>
            {selectedRestArea && (
                <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                    <RestAreaModalContent area={selectedRestArea} />
                </Modal>
            )}
        </div>
    );
}

export default RestAreaDetail;
