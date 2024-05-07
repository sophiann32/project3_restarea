import React from 'react';
import './Stationinfo.css';

function Stationinfo({ name, address, distance, price }) {
    return (
        <div className="station-info">
            <h4>{name}</h4>
            <p>{address}</p>
            {price && <p>{price}원</p>}
            <p>{distance}</p>
        </div>
    );
}

export default Stationinfo;
