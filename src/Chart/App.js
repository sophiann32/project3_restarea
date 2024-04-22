//현빈님 보내준 자료
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Routes, Route, Outlet} from 'react-router-dom';
import ChartDonut from './routes/ChartDonut.js';
import ChartLineCombo from "./routes/ChartLineCombo";

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

        <Routes>
            <Route path="/chartlinecombo" element={ <ChartLineCombo stations={stations}/> } />

            <Route path="/chart" element={ <ChartDonut stations={stations}/> } />
        </Routes>

  );


}
export default App;
