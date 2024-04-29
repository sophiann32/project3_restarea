import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [stations, setStations] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/api/gas-stations')  // Flask 서버의 주소 입력
            .then(response => {
                console.log(response.data); // 데이터가 콘솔에 출력됩니다.
                setStations(response.data);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            })
    }, []);    return (
        <div>
            <h1>주유소 정보</h1>
            <pre>{JSON.stringify(stations, null, 2)}</pre> {/* 데이터를 화면에 출력 */}
            <ul>
                {stations.map(station => (
                    <li key={station.name}>
                        {station.name} - {station.price} - {station.brand}
                    </li>
                ))}
            </ul>
        </div>
    );

}

export default App;
