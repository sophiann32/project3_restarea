import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Map, MapMarker } from "react-kakao-maps-sdk";
import Modal from '../Modal/Modal';
import styles from './restAreaDetail.module.css';
import RestAreaModalContent from '../kako_map/RestAreaModalContent';

function RestAreaDetail({ selectedRoute }) {
    const [position, setPosition] = useState({ lat: 36.5, lng: 127.5 });
    const [zoomLevel, setZoomLevel] = useState(12);
    const [restAreas, setRestAreas] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRestArea, setSelectedRestArea] = useState(null);
    const [isOpen, setIsOpen] = useState(false); // Hover

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
            setZoomLevel(12); // Zoom level
        }
    }, [selectedRoute]);

    const normalizeName = (name) => {
        return name.replace(/휴게소|주유소|정류장|터미널/g, '').trim();
    };

    const handleMarkerClick = (area) => {
        const normalizedAreaName = normalizeName(area.휴게소명);

        Promise.all([
            axios.get(`http://localhost:5000/restbrands?routeNm=${selectedRoute}`),
            axios.get(`http://localhost:5000/fuelprices?routeNm=${selectedRoute}`),
            axios.get(`http://localhost:5000/facilities?routeNm=${selectedRoute}`),
            axios.get(`http://localhost:5000/bestfoods?routeNm=${selectedRoute}`)
        ]).then(([brandResponse, fuelResponse, facilityResponse, bestFoodResponse]) => {
            const brandData = brandResponse.data.list;
            const fuelData = fuelResponse.data.list;
            const facilityData = facilityResponse.data;
            const bestFoodData = bestFoodResponse.data.list;

            const facility = facilityData.list.find(f => normalizeName(f.serviceAreaName) === normalizedAreaName);
            const brand = brandData.find(b => normalizeName(b.stdRestNm) === normalizedAreaName);
            const fuel = fuelData.find(f => normalizeName(f.serviceAreaName) === normalizedAreaName);
            const bestFoods = bestFoodData.filter(f => normalizeName(f.stdRestNm) === normalizedAreaName);

            const updatedArea = {
                ...area,
                convenience: facility ? facility.convenience : '정보 없음',
                brandInfo: brand ? {
                    brdName: brand.brdName,
                    stime: brand.stime,
                    etime: brand.etime,
                    brdDesc: brand.brdDesc,
                    lsttmAltrDttm: brand.lsttmAltrDttm
                } : null,
                fuelPrices: fuel ? {
                    diselPrice: fuel.diselPrice.replace('원', ''),
                    gasolinePrice: fuel.gasolinePrice.replace('원', ''),
                    lpgPrice: fuel.lpgPrice.replace('원', ''),
                    telNo: fuel.telNo
                } : null,
                bestFoods: bestFoods.map(food => ({
                    foodNm: food.foodNm,
                    foodCost: food.foodCost,
                    lsttmAltrDttm: food.lsttmAltrDttm
                }))
            };

            setSelectedRestArea(updatedArea);
            setModalOpen(true);
        }).catch(error => {
            console.error('Error fetching data: ', error);
        });
    };

    return (
        <div>
            <Map center={position} level={zoomLevel} style={{ width: "100%", height: "900px" }}>
                {restAreas.map((area, index) => (
                    <MapMarker
                        key={index}
                        position={{ lat: area.위도, lng: area.경도 }}
                        onClick={() => handleMarkerClick(area)}
                        onMouseOver={() => setIsOpen(area)}
                        onMouseOut={() => setIsOpen(null)}
                        image={{
                            src: "https://images.emojiterra.com/google/noto-emoji/unicode-15.1/color/512px/1f53b.png",
                            size: {
                                width: 30,
                                height: 35,
                            },
                        }}
                    >
                        {isOpen === area && (
                            <div style={{ fontSize: 17, color: '#000000', backgroundColor: '#fffefe', padding: '5px', borderRadius: '5px', textAlign: 'center' }}>
                                {area.휴게소명}
                            </div>
                        )}
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
